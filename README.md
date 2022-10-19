# Web3 blog demo

English | [中文](./docs/README_CN.md)

This is a Web3 Blog dApp demo, developed with Next.js for frontend, EVM-compatible smart contract for backend, IPFS for media data store.

What it looks like:
![Frontend](./docs/assets/demo.png)

## 1. Prerequisites

<details>
<summary>1) Install Wallet plugin into your browser, such as <a href='https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm'>MetaMask</a>. </summary>

![Install metamask](./docs/assets/metamask-install.jpg)
</details>

<details>
<summary>2) Create or import your Ethereum account into wallet.</summary>

![Create account in metamask step 1](./docs/assets/metamask-create-account-1.jpg)
![Create account in metamask step 2](./docs/assets/metamask-create-account-2.jpg)
</details>

<details>
<summary>3) Add Polygon Mumbai testnet into wallet.</summary>

![Add network step 1](./docs/assets/metamask-add-network-1.jpg)
![Add network step 2](./docs/assets/metamask-add-network-2.jpg)
![Add network step 3](./docs/assets/metamask-add-network-3.jpg)
</details>

<details>
<summary>4) Switch to Mumbai Testnet.</summary>

![Add network step 1](./docs/assets/metamask-switch-to-mumbai.jpg)
</details>

<details>
<summary>5) Get some MATICs from <a href='https://mumbaifaucet.com/'>MUMBAI FAUCET</a> or <a href='https://faucet.polygon.technology/'>this</a>(it's free and this token has no values), so that you can pay the transaction fees</summary>

![Get MATICs option 1](./docs/assets/get-matic-1.jpg)
![Get MATICs option 2](./docs/assets/get-matic-2.jpg)
</details>

## 2. One-click IPFS node setup template

In this demo, we'll use the decentrailized file storage service, IPFS, to store media files, in order to get better user experience for end-users, we can setup our own IPFS service instead of using public service provider's.

Here we provide a AWS CloudFormation template to help launch a single IPFS node on AWS EC2, so that you can setup IPFS service with several clicks, rather than dive into IPFS deployment details.

The IPFS kubo version inclueded in the template is 0.16.0, you may change the template file and upgrade to newer version if needed.

**WARN 1**: The IPFS node created using this template is open to public and for short-time test purpose only, you can modify its security group to limit access only from your own IP, check this [doc](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/working-with-security-groups.html#updating-security-group-rules) for more information.

**WARN 2**: The EC2 instance and related resources may incur cost of your AWS account.

### 1) Architecture
In this template, we'll create a VPC with Subnets, the EC2 instance is placed in a Public Subnet and assigned with a public IP address automatically.

![Arch](./docs/assets/ipfs-node-arch.png)

### 2) Default security group rules
| Port | Allowed Source | Description
| - | - | -
| TCP 22 | 0.0.0.0/0 | SSH
| TCP 3000 | 0.0.0.0/0 | Node.js backend server
| TCP 4001 | 0.0.0.0/0 | IPFS p2p network
| TCP 5001 | 0.0.0.0/0 | IPFS API endpoint
| TCP 8080 | 0.0.0.0/0 | IPFS Gateway endpoint

### 3) Deployment option 1 - China Regions

Click to setup IPFS instance in AWS China Region. You can use default settings in CloudFormation console.

[![Launch Stack](./docs/assets/launch-stack.png)](https://console.amazonaws.cn/cloudformation/home?#/stacks/create/review?templateURL=https://workshop-binc.s3.cn-northwest-1.amazonaws.com.cn/web3-demo/ipfs-single-node-template.yaml&stackName=ipfs-node) 

### 4) Deployment option 2 - Global Regions
Click to setup IPFS instance in AWS Global Region. You can use default settings in CloudFormation console.

[![Launch Stack](./docs/assets/launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?#/stacks/create/review?templateURL=https://workshop-binc.s3.cn-northwest-1.amazonaws.com.cn/web3-demo/ipfs-single-node-template.yaml&stackName=ipfs-node)

### 5) CloudFormation outputs

In the CloudFormation Console, navigate to the Outputs tab and note down the ApiEndpoint, GatewayEndpoint and WebUI urls, we'll use them in following steps.

![CFn Ouputs](./docs/assets/cloudformation-outputs.jpg)

## 3. Steps to run this demo

You may deploy this demo into the EC2 instance created in last step, or into your local computer, we'll choice the prior method.

### 1) Install Node.js v16

We'll use [nvm.sh](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating) to install nodejs env.

```bash
# This installs nvm into ~/.nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash 

# This loads nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# This installs nodejs version 16.17
nvm install 16.17 
```

### 2) Upload an image to IPFS

In our demo, a cover image is used as our homepage's background, this image is saved in IPFS network. The [cid](https://docs.ipfs.tech/concepts/content-addressing/#what-is-a-cid) of this image will be stored in the Blog smart contract.

There’re handful tools can be used to upload image file to IPFS, such as IPFS CLI, IPFS Desktop app and so on. Here we'll use the IPFS WebUI, you can find the WebUI URL in [CloudFormation outputs](#5-cloudformation-outputs) section. Open this URL in a new browser tab, here's what it looks like:

![WebUI home](./docs/assets/webui-home.jpg)

In the Files tab, import a image file you like, and note down the cid, i.e. *QmfSZ...zAqW* in this screenshot.
![WebUI upload file](./docs/assets/webui-upload-file.jpg)

### 3) Download source code

Login to your IPFS EC2 instance and clone source code.

```bash
git clone https://github.com/Chen188/web3-dApp-demo && cd web3-dApp-demo && npm install
```

### 4) Edit local environment file

```bash
cp .env.testnet .env.local
```
Edit *.env.local*:

- Set value of *NEXT_PUBLIC_ipfs_gateway* and *NEXT_PUBLIC_ipfs_uri* with the outputs in section [CloudFormation outputs](#5-cloudformation-outputs), or use public IPFS service such as [Infura](https://infura.io/). For example:

    ```
    NEXT_PUBLIC_ipfs_gateway=http://1.2.3.4:5001/api/v0
    NEXT_PUBLIC_ipfs_uri=http://1.2.3.4:8080/ipfs/
    ```
- If you're using Infura IPFS service, you can set *NEXT_PUBLIC_ipfs_auth_user* with your Infura IPFS project id, and *NEXT_PUBLIC_ipfs_auth_password* with Infura IPFS project secret.

### 5) Edit the smart contract deployment script

Edit the `./scripts/deploy.sh` with your prefered editor, replace *QmeisUNzsWHmjmD8hX3mGsC8sYiYYwx2Qif98bHJPBvQsG* with the cid in section [Upload an image to IPFS](#2-upload-an-image-to-ipfs), save & close this file.

### 6) Deploy the smart contract
```bash
# this will deploy Blog Contract into the address corresponding to pk.
pk=<replace-with-your-private-key> npx hardhat run scripts/deploy.js
```

### 7) Build and run
1. Run `npm run build && npm run start`
    
    ```bash
    % npm run build && npm run start

    > web3-blog-demo@0.1.0 build
    > next build

    info  - Loaded env from /Users/binc/ror/nextjs-blog/.env.local
    info  - Linting and checking validity of types  
    info  - Creating an optimized production build  
    info  - Compiled successfully
    ...
    ready - started server on 0.0.0.0:3000, url: http://localhost:3000
    info  - Loaded env from /Users/binc/ror/nextjs-blog/.env.local
    ```
1. Open http://<your.ec2.public.ip>:3000 in your browser