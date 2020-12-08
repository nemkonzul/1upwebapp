import subprocess

def master_changed():
    # checking my local HEAD
    HEAD = subprocess.check_output('git rev-parse HEAD',
                                    cwd='../.',
                                    shell=True,
                                    universal_newlines=True)
    # checking the master's HEAD
    UPSTREAMHASH = subprocess.check_output('git ls-remote | grep HEAD | cut -f 1',
                                           cwd='../.',
                                           shell=True,
                                           universal_newlines=True)
    if HEAD == UPSTREAMHASH:
        print('Master hasn\'t changed')
        return False

    # get the latest code changes
    subprocess.run('git pull origin master', cwd='../.', shell=True,
                   universal_newlines=True)
    return True


def run_unit_tests():
    return subprocess.call('jest .tests/', cwd='../.', shell=True)


def build():
    return subprocess.call('npm run build', cwd='../.', shell=True)


def deploy(env):
    # Once the build process is successful, and the tests are passing too
    # serverless deploy command is invoked for the select environment
    if build() == 0 and run_unit_tests() == 0:
        subprocess.run(['sls', 'deploy', '--stage', env], cwd='../.')


def reading_input():
    return input(""" 
    Provide a command number to run:
    ================================
    - 1) Basic flow: Check master for changes, build, test, and deploy to dev
    - 2) Build, test, deploy to dev
    - 3) Build, test, deploy to prod
    > """)


def run():
    command_list = {'basic flow': '1',
                    'deploy dev': '2',
                    'deploy prod': '3'}

    while True:
        command = reading_input()
        if command == command_list['basic flow']:
            if master_changed():
                deploy('dev')
                return
        elif command == command_list['deploy dev']:
            deploy('dev')
            return
        elif command == command_list['deploy prod']:
            deploy('prod')
            return
        else:
            print("Invalid command, please choose from the list")


if __name__ == "__main__":
    run()
