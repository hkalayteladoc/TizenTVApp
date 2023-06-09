
curl -X POST -H "Content-Type: application/json" -d "{\"key1\":\"value1\", \"key2\":\"value2\"}"  http://localhost:8000/data

@REM curl -d "{'key1':'value1', 'key2':'value2'}" -H "Content-Type: application/json" -X POST http://localhost:8000/data

@REM with a data file
@REM curl -d "@data.json" -X POST http://localhost:8000/data