#!/usr/bin/env node
require('dotenv').config();
const jsonfile = require("jsonfile");
const moment = require("moment");
const sgit = require("simple-git");
const git = sgit({ config: [ `http.extraHeader=Authorization: Basic ${btoa(process.env.TOKEN)}` ] });
const _s = require("scramb");
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');
const prompts = require('prompts');
prompts.override(require('yargs').argv);

const filepath = "./data.json";

async function main() {
  const res = await prompts([
    { type: 'number', name: 'days', message: 'days to subtract?', initial: 0 },
    { type: 'number', name: 'totalCommit', message: 'how many commits?', initial: 7 },
    { type: 'confirm', name: 'confirm', message: 'proceed?', initial: true }
  ]);

  if(!res.confirm) return;

  const DATE = moment().subtract(res.days, 'd').format();

  let i = 0;
  let interval = setIntervalAsync(async() => {
    if(i === res.totalCommit) {
      await git.push();
      return clearIntervalAsync(interval);
    }

    let data = { data: DATE, r: _s.passGen(8).result };
    jsonfile.writeFile(filepath, data, async function () {
      console.log(data);
      await git.add('./*').commit(DATE, { "--date": DATE });
    });

    await git.push();
    
    i++
  }, 3000)
}

main();
