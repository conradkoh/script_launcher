import fs from 'fs';
import path from 'path';
import { parseConfig, printProjectGroupList, formatShellInitScripts } from './config';
import readline from 'readline';
import { exec } from 'child_process';
const config_filepath = path.resolve(path.join(__dirname, '/../config.json'));
const config_data = fs.readFileSync(config_filepath);
let project_configs = parseConfig(config_data.toString());

(async () => {
    const iface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const selected_config_idx: number = await new Promise((resolve, reject) => {
        iface.question(
            `Select a project:\n${printProjectGroupList(project_configs)}\n`,
            (result) => {
                const config_idx: number = parseInt(result) - 1;
                resolve(config_idx);
            }
        );
    });
    let selected_config = project_configs[selected_config_idx];
    if (selected_config) {
        console.log(`You have selected ${selected_config.project_group}`);
        let started: string[] = [];
        let shell_init = formatShellInitScripts(selected_config.shell_init_scripts) || '';
        for (let executable of selected_config.executable_items) {
            let { name, cwd, command } = executable;
            await new Promise((resolve, reject) => {
                const command_final = `${shell_init} ${command}`;
                let t = exec(command_final, { cwd, shell: '/bin/zsh' }, (err, stdout, stderr) => {
                    err ? reject(new Error(stderr)) : resolve(stdout);
                });
            });
            started.push(name);
        }
        const started_list = started.reduce((state, item, idx) => {
            if (idx > 0) {
                state += '\n';
            }
            state += `${idx + 1}. ${item}`;
            return state;
        }, '');
        console.log(`Script launcher:\n${started_list}`);
    }
})()
    .then(() => console.log('done!'))
    .catch(() => console.error('errors occured during launch.'))
    .then(() => process.exit());
