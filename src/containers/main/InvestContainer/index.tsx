import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MiniChart } from 'react-ts-tradingview-widgets';
import { UserSettings } from 'components/layout/UserSettings';
import { InvestNav } from 'components/layout/InvestNav';
import { useTranslation } from 'react-i18next';
import { useShallowSelector } from 'hooks/useShallowSelector';
import { selectMain } from 'store/main/selectors';
import { RICAddress } from 'constants/polygon_config';
import { useDispatch } from 'react-redux';
import { startFlowAction, stopFlowAction } from 'store/main/actionCreators';
import styles from './styles.module.scss';
import { InteractiveStreamManager } from '../InteractiveStreamManager';
import { TabPanel } from './InvestTabPanel';
import { InvestMarket } from './InvestMarket';

export enum TABS {
	'MARKET',
	'INTERACTIVE',
	'PRICE_CHART',
}

interface IProps {}
export const InvestContainer: React.FC<IProps> = () => {
	const { t } = useTranslation();
	const state = useShallowSelector(selectMain);
	const { address, balances } = state;
	const dispatch = useDispatch();

	const [currentTab, setCurrentTab] = useState<TABS>(TABS.MARKET);
	const switchTab = (evt: React.SyntheticEvent, tab: TABS) => setCurrentTab(tab);

	const handleStart = useCallback(
		(config: { [key: string]: string }) => (amount: string, callback: (e?: string) => void) => {
			dispatch(startFlowAction(amount, config, callback));
		},
		[dispatch],
	);

	const handleStop = useCallback(
		(config: { [key: string]: string }) => (callback: (e?: string) => void) => {
			dispatch(stopFlowAction(config, callback));
		},
		[dispatch],
	);

	return (
		<div className={styles.outer_container}>
			<InvestNav />
			<div className={styles.settings_mob}>
				<UserSettings
					className={styles.dot}
					ricBalance={balances && balances[RICAddress]}
					account={address || t('Connect Wallet')}
				/>
			</div>
			<div className={styles.container}>
				<div
					className={styles.content}
					style={
						currentTab === TABS.INTERACTIVE
							? { width: '100%', height: 'calc(100vh - 200px)', overflowY: 'scroll' }
							: {}
					}
				>
					<Box sx={{ width: '100%', height: '100%' }}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs value={currentTab} onChange={switchTab} aria-label="rex market tabs">
								<Tab label="Market" id={`${TABS.MARKET}`} aria-controls={`tabpanel-${TABS.MARKET}`} />
								<Tab
									label="Interactive"
									id={`${TABS.INTERACTIVE}`}
									aria-controls={`tabpanel-${TABS.INTERACTIVE}`}
								/>
								<Tab
									label="Price Chart"
									id={`${TABS.PRICE_CHART}`}
									aria-controls={`tabpanel-${TABS.PRICE_CHART}`}
								/>
							</Tabs>
						</Box>
						<TabPanel index={TABS.MARKET} tab={currentTab}>
							<InvestMarket handleStart={handleStart} handleStop={handleStop} />
						</TabPanel>
						<TabPanel index={TABS.INTERACTIVE} tab={currentTab}>
							<InteractiveStreamManager handleStart={handleStart} handleStop={handleStop} />
						</TabPanel>
						<TabPanel index={TABS.PRICE_CHART} tab={currentTab}>
							<MiniChart colorTheme="dark" symbol="SUSHISWAPPOLYGON:RICUSDC" />
						</TabPanel>
					</Box>
				</div>

				<div>
					<span className={styles.fee_disclaimer}>{t('Ricochet takes a 2% fee on swaps.')}</span>
				</div>
			</div>
		</div>
	);
};
