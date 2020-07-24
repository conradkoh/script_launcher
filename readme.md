# Script Laucher

Execute multiple commands from your configuration through a command selector. Shell init scripts are executed on the initialization of each shell, before each execution item is run.

# Installation

1. Build the project with the command `npm run build`
2. Create a new configuration

## Sample Configuration

```json
{
  "zave": {
    "shell_init_scripts": [
      {
        "name": "Init ZSH RC",
        "command": "source ~/.zshrc"
      },
      {
        "name": "Use Node 12",
        "command": "nvm use 12"
      }
    ],
    "executable_items": [
      {
        "name": "api",
        "cwd": "/Users/MyUser/Documents/projects/api",
        "command": "pm2 start --name=api npm -- run nodemon"
      },
      {
        "name": "webapp",
        "cwd": "/Users/MyUser/Documents/projects/webapp",
        "command": "pm2 start --name=webapp npm -- run nodemon"
      }
    ]
  }
}
```
