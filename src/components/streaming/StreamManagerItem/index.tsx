import React, { useState, FC } from 'react';
import deleteFlow from 'utils/superfluidStreams/deleteFlow';
import { calculateFlowRate } from 'utils/calculateFlowRate';
import { blockInvalidChar } from 'utils/blockInvalidChars';
import updateExistingFlow from 'utils/superfluidStreams/updateExistingFlow';
import { truncateAddr } from 'utils/helpers';
import { TokenIcon } from 'components/common/TokenIcon';
import { CoinPlaceholder } from 'components/common/CoinPlaceholder';

import styles from './styles.module.scss';

interface IProps {
  receiver: string,
  TokenName: string | undefined, 
  currentFlowRate: string,
  sender: string,
  TokenID: string,
  timestamp: number,
  transactionHash: number,
}

export const StreamManagerItem: FC<IProps> = ({
  receiver,
  TokenName,
  currentFlowRate,
  sender,
  TokenID, 
  timestamp,
}) => {
  const SECONDS_PER_MONTH = 30 / 24 / 60 / 60;

  const time = new Date(timestamp * 1000).toString().split(' ')[4];

  const [updateOperation, toggleUpdate] = useState(false);
  const [updatedFlowRate, updateFlowRate] = useState('');

  console.log(TokenID, TokenName, time);

  return (
    <div className={styles.streamRow}>
      <div className="stream">
        <img src="" alt="" className="" />
        <h3 className={styles.receiver}>
          <strong>To: </strong>
          {truncateAddr(receiver)}
        </h3>
        
        {TokenName ? (
          <>
            {/* @ts-expect-error */}
            <TokenIcon tokenName={TokenName} />
            <br />
            <CoinPlaceholder token={TokenID} /> 
          </>
        )
 
          : 
          ''}
      </div>
    
      <div className={styles.info}>
        
        <h3 className={styles.currentFlow}>
          {`of $${Math.trunc((+currentFlowRate / 1e8) * SECONDS_PER_MONTH)} per month, $${(+currentFlowRate / 1e18).toFixed(8)} per second`}
        </h3>

        <div className={styles.update_buttons}>
          <button 
            className={styles.change_flow_update} 
            onClick={async () => { await toggleUpdate(true); }}
          >
            Update Flow
          </button>
          <button 
            className={styles.change_flow_cancel} 
            onClick={() => { deleteFlow(sender, receiver, TokenID); }}
          >
            Delete Flow
          </button>
        </div>
      </div>

      {
        updateOperation ? (
          <div className={styles.updatePrompt}>
            <div className={styles.amount_container}>
              <h3 className={styles.amount_label}>What is the new payment amount?</h3>
              <input
                id="payment"
                className={styles.input_field} 
                type="number" 
                placeholder="Payment Amount Per month in" 
                onKeyDown={blockInvalidChar}
                min={0}
                onChange={async (e) => { 
                  const newFlow = await calculateFlowRate(+(e.target.value));
                  if (newFlow) {
                    await updateFlowRate(newFlow.toString());
                    console.log(newFlow.toString);
                  }
                }}
              />
              <span>Per month</span>
            </div>

            <button 
              className={styles.amount_change}
              disabled={updatedFlowRate === ''}
              onClick={() => { updateExistingFlow(receiver, updatedFlowRate, TokenID); }}
            >
              Confirm
            </button>
          </div>
        )
          :
          ''
      }
    </div>
  );
};
