[![npm](https://img.shields.io/github/package-json/v/chandq/gitlab-dingtalk-cli?style=flat-square)](https://www.npmjs.com/package/gitlab-dingtalk-cli)

# 🦅 gitlab-dingtalk-cli

## Description

Based on Gitlab CI and DingTalk custom robot, a CLI tool that push message to DingTalk App.

In order to push message, need to prepare as-follows things:

- DingTalk custom robot, get access_token and secret.
- gitlab-ci.yml, and pass environment variables: `CI_DINGTALK_TOKEN`, `CI_DINGTALK_SECRET`
