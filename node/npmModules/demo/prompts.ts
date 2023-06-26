import prompts from 'prompts'

const result = await prompts(
    [
        {
            name: 'projectName',
            type: 'text',
            message: 'Project name:',
            initial: 'demo',
            onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
            name: 'shouldOverwrite',
            type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
            message: () => {
                const dirForPrompt =
                    targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

                return `${dirForPrompt} is not empty. Remove existing files and continue?`
            }
        },
        {
            name: 'overwriteChecker',
            type: (prev, values) => {
                if (values.shouldOverwrite === false) {
                    throw new Error(red('✖') + ' Operation cancelled')
                }
                return null
            }
        },
        {
            name: 'packageName',
            type: () => (isValidPackageName(targetDir) ? null : 'text'),
            message: 'Package name:',
            initial: () => toValidPackageName(targetDir),
            validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
            name: 'needsTypeScript',
            type: () => ('toggle'),
            message: 'Add TypeScript?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        },
        {
            name: 'needsJsx',
            type: () => ('toggle'),
            message: 'Add JSX Support?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        },
        {
            name: 'needsRouter',
            type: () => ('toggle'),
            message: 'Add Vue Router for Single Page Application development?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        },
        {
            name: 'needsPinia',
            type: () => ('toggle'),
            message: 'Add Pinia for state management?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        },
        {
            name: 'needsE2eTesting',
            type: () => ('select'),
            message: 'Add an End-to-End Testing Solution?',
            initial: 0,
            choices: (prev, answers) => [
                { title: 'No', value: false },
                {
                    title: 'Cypress',
                    description: answers.needsVitest
                        ? undefined
                        : 'also supports unit testing with Cypress Component Testing',
                    value: 'cypress'
                },
                {
                    title: 'Nightwatch',
                    description: answers.needsVitest
                        ? undefined
                        : 'also supports unit testing with Nightwatch Component Testing',
                    value: 'nightwatch'
                },
                {
                    title: 'Playwright',
                    value: 'playwright'
                }
            ]
        },
        {
            name: 'needsEslint',
            type: () => ('toggle'),
            message: 'Add ESLint for code quality?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        },
        {
            name: 'needsPrettier',
            type: () => {'toggle'},
            message: 'Add Prettier for code formatting?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        }
    ],
    {
        onCancel: () => {
            throw new Error(red('✖') + ' Operation cancelled')
        }
    }
)
} catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
}