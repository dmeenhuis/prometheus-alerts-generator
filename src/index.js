import fs from 'fs-extra';
import handlebars from 'handlebars';
import path from 'path';

import configuredServices from './service-config';

const templateDir = path.join(process.cwd(), 'alert-templates');

const getTemplateContents = async template => (await fs.readFile(path.join(templateDir, template))).toString();
const templateWithoutExtension = template => template.replace('.tmpl', '');

const getAlertTitle = (team, service) =>
  service
    .replace('blaze-', '')
    .replace(/(-nl|be)(\.[a-z]+)?$/i, '')
    .split('-')
    .map(x => x.substring(0, 1).toUpperCase() + x.substring(1))
    .join('');

const createAlertFromTemplate = async (service, template) => {
  const { alerts, team } = configuredServices[service];
  const templateName = templateWithoutExtension(template);
  const { ignore = false, ...alertConfig } = alerts[templateName] || {};

  if (ignore) return '';

  const title = getAlertTitle(team, service);
  const contents = await getTemplateContents(template);
  const templateData = {
    service,
    team,
    title,
    ...alertConfig
  };

  const alertContents = handlebars.compile(contents)(templateData);
  const [ , alertTitle ] = /ALERT (.*)$/m.exec(alertContents);

  return `${alertTitle}: |\n` + alertContents;
}

const generateAlertsForService = templates => async service =>
  (await Promise.all(templates.map(async template => await createAlertFromTemplate(service, template)))).join('');

(async function() {
  const templates = await fs.readdir(templateDir);
  const services = Object.keys(configuredServices);

  const alerts = (await Promise.all(services.map(generateAlertsForService(templates)))).join('');

  console.log(alerts);
})();
