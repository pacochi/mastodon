#!/bin/bash

set -eu -o pipefail

cd $(dirname $0)/../..

read -p 'デプロイされたDockerイメージは誰でもアクセスが可能になります。本当にデプロイしますか？ [yes/no]: ' answer
if [ "$answer" != "yes" ]; then
  exit 0
fi

.circleci/primary/build.sh
docker push $(.circleci/primary/tag.sh)
