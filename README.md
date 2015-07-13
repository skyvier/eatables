# eatables
A web application for everyday meal planning.

### configuration
The application uses a MongoDB database. Database settings
should be edited to config.json according to the following
schema:

```
{
  "type": "object"
  "properties": {
    "server_url": { "type": "string" },
    "server_port": { "type": "string" },
    "db_name": { "type": "string" }
  },
  "required": ["server_url", "db_name"]
}
```
If server_port isn't specified, eatables will use the
standard port (27017).
