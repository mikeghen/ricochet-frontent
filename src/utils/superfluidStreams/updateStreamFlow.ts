import { Framework } from '@superfluid-finance/sdk-core';

async function updateExistingFlow(flowRate: string, recipient: string, token: string) {
  if (window.ethereum) {
    // @ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = Number(await window.ethereum.request({ method: 'eth_chainId' }));
  
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider,
    });
  
    const signer = provider.getSigner();
  
    try {
      const updateFlowOperation = sf.cfaV1.updateFlow({
        flowRate,
        receiver: recipient,
        superToken: token,
        // userData?: string
      });

      console.log('Updating your stream...');

      const result = await updateFlowOperation.exec(signer);
      console.log(result);
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!",
      );
      console.error(error);
    }
  }
}

export default updateExistingFlow;
