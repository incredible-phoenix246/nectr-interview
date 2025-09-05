import {
    createSIWEConfig,
    formatMessage,
    type SIWESession,
    type SIWEVerifyMessageArgs,
    type SIWECreateMessageArgs,
} from '@reown/appkit-siwe'
import {
    verifySignature,
    getChainIdFromMessage,
    getAddressFromMessage,
} from '@reown/appkit-siwe'
import { getAddress } from 'viem';
import { networks } from '~/utils/web3/wagmi';
import { getCsrfToken, getSession, signOut } from 'next-auth/react';
import { PROJECT_ID } from '../../lib/utils';





const normalizeAddress = (address: string): string => {
    try {
        const splitAddress = address.split(':');
        const extractedAddress = splitAddress[splitAddress.length - 1];
        const checksumAddress = getAddress(extractedAddress);
        splitAddress[splitAddress.length - 1] = checksumAddress;
        const normalizedAddress = splitAddress.join(':');

        return normalizedAddress;
    } catch (error) {
        return address;
    }
}

export const siweConfig = createSIWEConfig({
    getMessageParams: async () => ({
        domain: typeof window !== 'undefined' ? window.location.host : '',
        uri: typeof window !== 'undefined' ? window.location.origin : '',
        chains: networks.map((chain) => parseInt(chain.id.toString())),
        statement: 'Please sign with your account',
    }),
    createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
        formatMessage(args, normalizeAddress(address)),
    getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) {
            throw new Error('Failed to get nonce!');
        }

        return nonce;
    },
    getSession: async () => {
        const session = await getSession();
        if (!session) {
            return null;
        }
        if (typeof session.address !== "string" || typeof session.chainId !== "number") {
            return null;
        }

        return { address: session.address, chainId: session.chainId } satisfies SIWESession;
    },
    verifyMessage: async ({ message, signature, }: SIWEVerifyMessageArgs) => {
        const address = getAddressFromMessage(message)
        const chainId = getChainIdFromMessage(message)
        const isValid = await verifySignature({
            address,
            message,
            signature,
            chainId,
            projectId: PROJECT_ID,
        })
        return isValid;
    },
    signOut: async () => {
        try {
            await signOut({
                redirect: false,
            });

            return true;
        } catch (error) {
            return false;
        }
    },
});