# eatables
A Node.js web application for everyday meal planning.

### database configuration
The application uses a MongoDB database. Database settings
should be edited to `src/config.json` according to the following
schema:

```
{
  "type": "object",
  "properties": {
    "server_url": { "type": "string" },
    "server_port": { "type": "string" },
    "db_name": { "type": "string" }
  },
  "required": ["server_url", "db_name"]
}
```
If `server_port` isn't specified, eatables will use the
standard port (27017).

### eatables configuration
Some settings (such as food and ingredient types) can
be customized from the public eatables configuration file,
`src/public/configs.json`. It should be edited according to
the schema in `doc/configs/eatables.json`.

If the file isn't customized, hardwritten default values
will be used. Customizing this file won't alter the
existing database values.

