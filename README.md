InfluxDB-CLI [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/FGRibreau/influxdb-cli/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
============

SQL CLI for InfluxDB

### Installation
```shell
npm install influxdb-cli -g
```

### Screencast

[![screencast](http://i.imgur.com/VpCXxlm.gif)](http://showterm.io/0cec86260d6a74f636907#slow)

[Showterm Terminal recording](http://showterm.io/0cec86260d6a74f636907#slow)

### Options

```shell
InfluxDB SQL CLI
Usage: node ./influxdb-cli

Options:
  -h, --hostname  Host [%s]                             [default: "localhost"]
  --port          Port [%s]                             [default: 8086]
  -s, --secure    Use HTTPS if flag is present          [default: false]
  -u, --user      User [%s]                             [default: "root"]
  -p, --password  Password [%s]                         [default: "root"]
  -d, --database  Database [%s]                         [default: "db"]
  --pretty        Display time in a human readable way  [default: false]
```

### Usage

```shell
influxdb-cli -d redsmin -u user -p password
redsmin> Connecting to http://localhost:8086/db/redsmin ...
redsmin> ✔ ready
redsmin> SELECT used_memory, used_memory_lua, used_memory_peak from info limit 10;
┌───────────────┬─────────────────┬─────────────┬─────────────────┬──────────────────┐
│ time          │ sequence_number │ used_memory │ used_memory_lua │ used_memory_peak │
├───────────────┼─────────────────┼─────────────┼─────────────────┼──────────────────┤
│ 1383952323268 │ 1300            │ 1889826     │ 31744           │ 1889826          │
│ 1383952323258 │ 1299            │ 1889826     │ 31744           │ 1889826          │
│ 1383952317262 │ 1298            │ 1889826     │ 31744           │ 1889826          │
│ 1383952317254 │ 1297            │ 1889826     │ 31744           │ 1889826          │
│ 1383952311270 │ 1296            │ 1963522     │ 31744           │ 1963522          │
│ 1383952311261 │ 1295            │ 1963522     │ 31744           │ 1963522          │
│ 1383952305260 │ 1294            │ 1926674     │ 31744           │ 1926674          │
│ 1383952305253 │ 1293            │ 1926674     │ 31744           │ 1926674          │
│ 1383952299261 │ 1292            │ 1889826     │ 31744           │ 1889826          │
│ 1383952299257 │ 1291            │ 1889826     │ 31744           │ 1889826          │
└───────────────┴─────────────────┴─────────────┴─────────────────┴──────────────────┘
redsmin>
```

With `--pretty` activated

```
influxdb-cli -d redsmin -u user -p password --pretty
redsmin> Connecting to http://localhost:8086/db/redsmin ...
redsmin> ✔ ready
redsmin> SELECT used_memory, used_memory_lua, used_memory_peak from info limit 10;
┌──────────────────┬─────────────────┬─────────────┬─────────────────┬──────────────────┐
│       time       │ sequence_number │ used_memory │ used_memory_lua │ used_memory_peak │
├──────────────────┼─────────────────┼─────────────┼─────────────────┼──────────────────┤
│ 9/11/13 12:30:50 │ 1186            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:50 │ 1185            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:44 │ 1184            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:44 │ 1183            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:38 │ 1182            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:38 │ 1181            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:32 │ 1180            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:32 │ 1179            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:26 │ 1178            │ 1889826     │ 31744           │ 1889826          │
│ 9/11/13 12:30:26 │ 1177            │ 1889826     │ 31744           │ 1889826          │
└──────────────────┴─────────────────┴─────────────┴─────────────────┴──────────────────┘
redsmin>
```
### Commands

- `use [dbname]`: switch to database `dbname`.
- `quit`|`exit` : quit the cli
- `ping` : send the ping query
- `version` : get the database versopm from the connected server.


### History

v0.1.4 (30 Oct. 2014)

- [Feature] new `ping` and `version` commands #15 by @codyhanson

v0.1.3 (27 Oct. 2014)

- [Feature] Add HTTPS support. #14 by @codyhanson
- [Feature] Show series names #13 by @macbre 
- [Fix] Remove error message when just pressing enter #11 by @5outh 
