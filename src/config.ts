export function parseConfig(config_data: string) {
    let config = JSON.parse(config_data);
    let configs: ProjectConfiguration[] = [];
    for (let project_group in config) {
        const project_config_raw = config[project_group];
        const executable_items = project_config_raw.executable_items;
        const shell_init_scripts = project_config_raw.shell_init_scripts;
        configs.push(
            new ProjectConfiguration({
                project_group,
                shell_init_scripts,
                executable_items,
            })
        );
    }
    return configs;
}

export function printProjectGroupList(config: ProjectConfiguration[]) {
    return config.reduce((state, pconfig, idx) => {
        if (idx > 0) {
            state += '\n';
        }
        state += `${idx + 1}. ${pconfig.project_group}`;
        return state;
    }, '');
}

export function formatShellInitScripts(scripts: ExecutableItem[]) {
    const init = scripts.reduce((state, executable, idx) => {
        state += `${executable.command};`;
        return state;
    }, '');
    return init;
}

export class ProjectConfiguration {
    project_group: string;
    shell_init_scripts: ExecutableItem[];
    executable_items: ExecutableItem[];
    constructor(data: any) {
        const executable_items = data.executable_items || [];
        const shell_init_scripts = data.shell_init_scripts || [];
        this.project_group = data.project_group;
        this.shell_init_scripts = shell_init_scripts.map((i: any) => new ExecutableItem(i));
        this.executable_items = executable_items.map((i: any) => new ExecutableItem(i));
    }
}

export class ExecutableItem {
    name: string;
    cwd?: string;
    command: string;
    constructor(data: any) {
        this.name = data.name || '';
        this.cwd = data.cwd || null;
        this.command = data.command;
    }
}
