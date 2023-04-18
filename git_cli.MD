# Replace a branch with another - overwrite

## First, checkout the branch you want to merge into
git checkout release/1.0

## Merge the other branch, overwriting any conflicting changes with theirs
git merge release/pedroMerge --strategy-option=theirs

## Push the changes to the remote repository
git push origin release/1.0

# merge via github

## Clone the Bitbucket repository to your local machine using the git clone command. For example:

`git clone <bitbucket-repo-url>`

## Add the GitHub repository as a remote repository for the cloned Bitbucket repository using the git remote add command. For example:

`git remote add github https://github.com/johnashu/madnfts-solidity-contracts.git`

## Fetch the changes from the GitHub repository using the git fetch command with the remote repository name and branch name. For example:

`git fetch github main`

## Checkout the target branch in the Bitbucket repository where you want to merge the changes. For example:

`git checkout release/pedroMerge`

## Merge the changes from the GitHub branch into the Bitbucket branch using the git merge command. For example:

`git merge github/main`

## Push the merged changes to the Bitbucket repository using the git push command. For example:

`git push origin release/pedroMerge`


# Merge Back to Github

## Fetch the changes from the GitHub repository using the git fetch command with the remote repository name and branch name. For example:

`git fetch origin`

`git fetch github main`

`git checkout github/main`

`git merge origin release/1.0`

`git push github release/1.0`

`git push github main`


0.8.19
It also contains a fix for a long-standing bug that can result in code that is only used in creation code to also be included in runtime bytecode.