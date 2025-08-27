# Execution script for the project
#!/bin/sh

# Installing python dependencies:
pip3 install typer
pip3 install PyInquirer
pip3 install PyInquirer
pip3 install rich
pip3 install cli-box
pip3 install aptos-sdk

# Installing frontend dependencies:
cd frontend
yarn

# check if user wants to open the dapp
echo Do you want to run dapp (yes/no)?
read varname

if [ $varname == 'yes']; then
    echo running dapp
    yarn dev
else 
    cd ..
    echo run `yarn dev` to run the dapp
fi