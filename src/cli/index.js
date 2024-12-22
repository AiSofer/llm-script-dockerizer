#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const { wrapScriptProcess } = require('./wrapperService');
require('dotenv').config();

const program = new Command();

program
    .name('lsd-cli')
    .description('A CLI tool to wrap scripts with Dockerfile using AI models')
    .version('1.0.0');

program
    .command('wrap')
    .description('Wrap a script with a Dockerfile')
    .requiredOption('-s, --script <path>', 'Path to the script file')
    .requiredOption('-e, --example <example>', 'Example usage of the script')
    .action(async (options) => {
        const scriptPath = path.resolve(options.script);
        const exampleUsage = options.example;

        console.log('Wrapping the script with Dockerfile...');
        try {
            const result = await wrapScriptProcess(scriptPath, exampleUsage);
            console.log('Dockerfile generated and tested successfully:', result);
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

program.parse(process.argv);
