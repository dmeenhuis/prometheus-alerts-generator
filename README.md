# prometheus-alerts-generator

Generates alerts for Prometheus based on a given services configuration file.

## Service configuration

The file ``/src/service-config.js`` contains the configuration for which services alerts should be generated.

Example configuration file:

```javascript
export default {
  'blaze-account-service-nl': {
    team: 'selfservice',
    alerts: {
      'consul-unhealthy': {
        threshold: 2
      },
      'response-slow': {
        threshold: 500
      }
    }
  }
}
```

Each key in the object refers to a specific service. 

You can use the `alerts` object to specify custom variables that need to be passed to a given alert template. Use the name of the template without the ``.tmpl`` extension as a key in the object. All values in this object will be passed to the template.

### Ignoring an alert template

You can specify an optional ``ignore: true`` flag on a specific alert configuration object for a service. 

When this flag is detected, that specific alert template will not be generated.  

## Alert templates

Templates are stored in the ``/alert-templates`` directory in this repository. Handlebars is used as the templating engine.

### Variables

The following variables are passed to the template:

* title (generated based on the service name)
* service
* team
* list of custom variables specified in the service config

### Template requirements

A template file must:

* End with a newline;
* Use spaces as tabs, with 2 spaces as the indentation level;
* Be indented with 2 spaces

## Development

In order to make development easier, you can run the script in a file watch mode, so that it is run every time the source changes:

```bash
npm run watch
```

To just run the script and display the output:

```bash
npm start
```
