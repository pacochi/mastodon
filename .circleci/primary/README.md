CircleCIでのテストに使うDockerイメージを作ったりデプロイしたりするスクリプト群。

# 事前準備

必要なツールをインストールする。

- Docker https://www.docker.com/community-edition#/download
- CircleCI CLI https://circleci.com/docs/2.0/local-jobs/#installation

# Dockerイメージのビルド

`.circleci/config.yml` のコンテナのバージョンを任意の値に更新する。このバージョンに従ってビルドしたDockerイメージのタグ付けがスクリプトにより行われる。

```diff
 version: 2
 jobs:
   build:
     docker:
-      - image: pawoo/circleci-primary:20170608
+      - image: pawoo/circleci-primary:20170609
```

所望の変更を行ったら、下記コマンドでDockerイメージをビルドする。

```shell
$ .circleci/primary/build.sh
Sending build context to Docker daemon 78.37 MB
Step 1 : FROM debian:jessie
 ---> 054ace38b1e6
...
Step 4 : RUN ./setup.sh
 ---> Running in aadd208af40e
Successfully built c769aa37307c
```

# テスト

CircleCI CLIを使ってビルド済みのDockerイメージをテストする。

```shell
$ circleci build
====>> Spin up Environment
Build-agent version 0.0.3264-a1e616b (2017-05-20T16:57:22+0000)
Starting container pawoo/circleci-primary:20170609
====>> Checkout code
Warning: skipping this step: running locally
...
```

# デプロイ

まずは下記コマンドでDocker Hubにpawooユーザーでログインする。

```shell
$ docker login -u pawoo
Password:
Login Succeeded
```

下記コマンドでDockerイメージをDocker Hubへデプロイできる。
今のCircleCI2.0が `docker login` に対応していないため、**デプロイされたDockerイメージは誰でもアクセス可能になるので注意をする。**

```shell
$ .circleci/primary/deploy.sh
デプロイされたDockerイメージは誰でもアクセスが可能になります。本当にデプロイしますか？ [yes/no]: yes
The push refers to a repository [pawoo/circleci-primary:20170609]
29beacde41df: Pushed
0129e3190e08: Pushed
4afde8893acd: Pushed
20170522: digest: sha256:a7db69ee92555ffde49ff08605dbe4d882d84e639ddf81315cbab36c4bb7ff5a size: 1158
```
