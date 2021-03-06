import { ethers } from 'ethers';

enum ETHEREUM_NETWORK_TO_ID {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  XDAI = 100,
  ENERGY_WEB_CHAIN = 246,
  VOLTA = 73799,
  UNKNOWN = 0,
  LOCAL = 4447,
}

const getNetworkNameById = (id: number): string => ETHEREUM_NETWORK_TO_ID[id] ?? 'UNKNOWN';

const getEthBalance = async (provider: ethers.providers.BaseProvider, address: string): Promise<ethers.BigNumber> => {
  const balance = provider.getBalance(address);

  return balance;
};

export { getEthBalance, getNetworkNameById };
