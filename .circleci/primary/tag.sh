#!/bin/bash

set -eu -o pipefail

cd $(dirname $0)/..

ruby -ryaml -e 'puts YAML.load_file("config.yml")["jobs"]["build"]["docker"][0]["image"]'
