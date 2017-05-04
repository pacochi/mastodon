#!/bin/bash

set -eu -o pipefail

cd $(dirname $0)/../..

docker build . -f .circleci/primary/Dockerfile -t $(.circleci/primary/tag.sh)
