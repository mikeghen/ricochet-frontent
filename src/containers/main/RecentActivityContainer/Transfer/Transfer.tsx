import type { TransferEvent } from '@superfluid-finance/sdk-core';
import React, { FC } from 'react';
import { iconsCoin } from 'constants/coins';
import { TransactionLink } from 'components/common/TransactionLink';
import { tokenCoinTransformer } from 'constants/tokenCoinMap';
import styles from '../styles.module.scss';

type TransferProps = {
  event: TransferEvent;
  /** wallet connected address */
  account: string;
};

export const Transfer: FC<TransferProps> = ({ event, account }) => {
  const {
    token, timestamp, from, to, transactionHash,
    value,
  } = event;
  const tokenName = tokenCoinTransformer.find(({ token: t }) => t === token)?.coin!;
  const mobileReceiverCopying = `${to.slice(0, 7)}...${to.slice(-4)}`;
  const mobileSenderCopying = `${from.slice(0, 7)}...${from.slice(-4)}`;
  const time = new Date(timestamp * 1000).toString().split(' ')[4];

  const isUser = from === account.toLowerCase();

  /**
   * stop propagation of event to prevent rendering mobile activity details page.
   * 
   * @param e React.MouseEvent<HTMLDivElement>
   */
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className={styles.larger_streaming_wrapper}>
        <span>{time}</span>
        <div className={styles.larger_streaming_content}>
          <span>
            {isUser ? 'Sent' : 'Received'}
          </span>
          <img src={iconsCoin[tokenName]} alt={tokenName} />
          <span className={styles.amount}>
            {+value / 1e18}
            {' '}
            {tokenName}
          </span>
          <span>
            {isUser ? 'to' : 'from'}
            {' '}
            {isUser ? mobileReceiverCopying : mobileSenderCopying}
          </span>
        </div>
        <div className={styles.transaction_link_wrapper} role="button" aria-hidden="true" onClick={stopPropagation}>
          <TransactionLink transactionHash={transactionHash} />
        </div>
      </div>
      <>
        <div className={styles.streaming_wrapper}>
          <div className={styles.streaming_content}>
            <span>{time}</span>
            <span>
              {isUser ? mobileReceiverCopying : mobileSenderCopying}
            </span>
          </div>
          <div className={styles.recieved_wrapper}>
            <span>
              {isUser ? 'Sent' : 'Received'}
            </span>
            <img src={iconsCoin[tokenName]} alt={tokenName} />
            <span className={styles.amount}>
              {+value / 1e18}
              {' '}
              {tokenName}
            </span>
          </div>
        </div>
        <div className={styles.right_arrow}>
          <span>
            &gt;
          </span>
        </div>

      </>
    </>
  );
};
