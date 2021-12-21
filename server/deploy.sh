heroku container:push --app=glacial-inlet-65738 web
heroku container:release --app=glacial-inlet-65738 web
heroku logs --app=glacial-inlet-65738 --tail
heroku pg:credentials --app=glacial-inlet-65738 DATABASE
heroku config:set --app=glacial-inlet-65738 PGSSLMODE=require