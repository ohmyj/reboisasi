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
//    { type: 'number', name: 'days', message: 'days to subtract?', initial: 0 },
    { type: 'number', name: 'totalCommit', message: 'how many commits?', initial: 999 },
    { type: 'confirm', name: 'confirm', message: 'proceed?', initial: true }
  ]);

  if (!res.confirm) return;
  
  let n = jsonfile.readFileSync(filepath);
  const DATE = moment(n.data).subtract(1, 'd').format();

  let dataArr = [];
  for (let i = 0; i < res.totalCommit; i++) {
    let data = { data: DATE, r: _s.passGen(8).result };
    dataArr.push(data);
  }

  for (let i = 0; i < res.totalCommit; i++) {
    await jsonfile.writeFile(filepath, dataArr[i]);
    await git.add('./*').commit(dataArr[i].data, { "--date": dataArr[i].data });
    if ([1, 100, 200, 300, 400, 500, 800, 1000].includes(i + 1)) console.log("now", i+1);
  }
  await git.push();
}

main();

