/**
 * This script download api response and for all methods and save it to the ./public/data/*.json files
 */

import fs from 'fs';
import ProgressBar from 'progress';
import { Faculty, Group } from './types';
import api from './api';

const TRIMESTER_ID_1 = 1151;
const TRIMESTER_ID_2 = 1143;

const json2file = (path: string, obj: any) => {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + '\n');
};

(async () => {
  try {
    console.log('Start downloading');
    // let trimesters = await api.getTrimesters();
    // let trimesterId = trimesters[0].IdTrimester;
    // json2file(`./public/data/trimesters/${trimesterId}.json`, trimesters[0]);
    // json2file(`./public/data/trimesters/current.json`, trimesters[0]);
    let trimesterId = TRIMESTER_ID_1;
    let dirSchedule = `./public/data/schedule/${trimesterId}`;
    if (!fs.existsSync(dirSchedule)) fs.mkdirSync(dirSchedule);

    let faculties = await api.getFaculties();
    json2file(`./public/data/faculties.json`, faculties);

    const file: any = fs.readFileSync(`./public/data/lastUpdate.json`);
    const lastUpdate = JSON.parse(file);

    let facultiesWithGroups: Faculty[] = [];
    for (let f of faculties) {
      let groups = await api.getGroups(f.IdFaculty);
      let newFaculty = new Faculty(f);
      let bar = new ProgressBar(
        `${newFaculty.name} [:bar] :current/:total :percent :etas`,
        {
          width: 20,
          total: groups.length,
        }
      );
      for (let i = 0; i < groups.length; i++) {
        let g = groups[i];
        let schedule = await api.getSchedule(g.IdGroup, trimesterId);
        groups[i].hasSchedule = schedule.length > 1;
        if (schedule.length <= 1) {
          schedule = await api.getSchedule(g.IdGroup, TRIMESTER_ID_2);
          groups[i].hasSchedule = schedule.length > 1;
        }
        if (groups[i].hasSchedule) {
          schedule = schedule.map((lesson) => {
            lesson.Lesson = lesson.Lesson.replace(
              /(Физическая культура).*/,
              '$1'
            );
            return lesson;
          });
          const file: any = fs.readFileSync(`${dirSchedule}/${g.IdGroup}.json`);
          const oldSchedule = JSON.parse(file);
          if (JSON.stringify(schedule) !== JSON.stringify(oldSchedule)) {
            lastUpdate[g.IdGroup] = new Date();
          }
          json2file(`${dirSchedule}/${g.IdGroup}.json`, schedule);
          newFaculty.groups.push(new Group(g));
        }
        bar.tick();
      }
      if (newFaculty.groups.length > 0) facultiesWithGroups.push(newFaculty);
      json2file(`./public/data/groups/${f.IdFaculty}.json`, groups);
    }
    json2file(`./public/data/facultiesWithGroups.json`, facultiesWithGroups);
    json2file(`./public/data/lastUpdate.json`, lastUpdate);
  } catch (error) {
    if (error.status) console.log('error.status', error.status);
    if (error.code) console.log('error.code', error.code);
    if (error.config.url) console.log('error.config.url', error.config.url);
  }
})();
