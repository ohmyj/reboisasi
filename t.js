#!/usr/bin/env node
require('dotenv').config();
const jsonfile = require("jsonfile");
const moment = require("moment");
const sgit = require("simple-git");
const git = sgit({ config: [`http.extraHeader=Authorization: Basic ${btoa(process.env.TOKEN)}`] });
const _s = require("scramb");
const prompts = require('prompts');
prompts.override(require('yargs').argv);

const filepath = "./data.json";

async function main() {
  const res = await prompts([
    { type: 'number', name: 'days', message: 'days to subtract?', initial: 0 },
    { type: 'number', name: 'totalCommit', message: 'how many commits?', initial: 7 },
    { type: 'confirm', name: 'confirm', message: 'proceed?', initial: true }
  ]);

  if (!res.confirm) return;

  const DATE = moment().subtract(res.days, 'd').format();

  let dataArr = [];
  for (let i = 0; i < res.totalCommit; i++) {
    let data = { data: DATE, r: _s.passGen(8).result };
    dataArr.push(data);
  }

  for (let i = 0; i < res.totalCommit; i++) {
    console.log("now", i+1)
    await jsonfile.writeFile(filepath, dataArr[i]);
    await git.add('./*').commit(dataArr[i].data, { "--date": dataArr[i].data });
  }
  await git.push();
}

main();

