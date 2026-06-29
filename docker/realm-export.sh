#!/bin/bash

docker exec example-keycloak sh -c "cp -rp /opt/keycloak/data/h2 /tmp ; //opt/keycloak/bin/kc.sh export --realm my-app --dir //tmp --db dev-file --db-url 'jdbc:h2:file:/tmp/h2/keycloakdb;NON_KEYWORDS=VALUE' --users realm_file || true"
docker cp example-keycloak://tmp/my-app-realm.json ./my-app-realm.json
