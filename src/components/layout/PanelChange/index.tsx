import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontIcon, FontIconName } from 'components/common/FontIcon';
import { showErrorToast } from 'components/common/Toaster';
import ReactTooltip from 'react-tooltip';
import { ExchangeKeys } from 'utils/getExchangeAddress';
import { getLastDistributionOnPair } from 'utils/getLastDistributions';
import { useShallowSelector } from 'hooks/useShallowSelector';
import { AddressLink } from 'components/common/AddressLink';
import { getAddressLink } from 'utils/getAddressLink';
import { selectMain } from 'store/main/selectors';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import { useTranslation } from 'react-i18next';
import en from 'javascript-time-ago/locale/en.json';
import { getContract } from 'utils/getContract';
import { rexReferralAddress } from 'constants/polygon_config';
import { referralABI, streamExchangeABI } from 'constants/abis';
import { Coin } from 'constants/coins';
import { FlowTypes } from 'constants/flowConfig';
import { getShareScaler } from 'utils/getShareScaler';
import { AFFILIATE_STATUS, getAffiliateStatus } from 'utils/getAffiliateStatus';
import { CoinChange } from '../CoinChange';
import { CoinBalancePanel } from '../CoinBalancePanel';
import { CoinRateForm } from '../CoinRateForm';
// import Price from '../../common/Price';
import LpAPY from '../../common/LpAPY';
import Price from '../../common/Price';
import styles from './styles.module.scss';
import { useDispatch } from 'react-redux';
import { addReward } from 'store/main/actionCreators';

TimeAgo.addDefaultLocale(en);

interface IProps {
	placeholder?: string;
	onClickStart: (amount: string, callback: (e?: string) => void) => void;
	onClickStop: (callback: (e?: string) => void) => void;
	coinA: Coin;
	coinB: Coin;
	tokenA: string;
	tokenB: string;
	coingeckoPrice: number;
	balanceA?: string;
	balanceB?: string;
	totalFlow?: string;
	totalFlows?: number;
	streamEnd?: string;
	subsidyRate?: { perso: number; total: number; endDate: string };
	personalFlow?: string;
	// aggregateRewards?: (reward_amount: number) => void;
	mainLoading?: boolean;
	flowType: FlowTypes;
	contractAddress: string;
	exchangeKey: ExchangeKeys;
	isReadOnly?: boolean;
	indexVal?: number;
	streamedSoFar?: number;
	receivedSoFar?: number;
}

export const PanelChange: FC<IProps> = ({
	onClickStart,
	onClickStop,
	placeholder,
	coinA,
	coingeckoPrice,
	coinB,
	tokenA,
	tokenB,
	balanceA,
	balanceB,
	totalFlow,
	totalFlows,
	streamEnd,
	subsidyRate,
	personalFlow,
	mainLoading = false,
	flowType,
	isReadOnly,
	contractAddress,
	exchangeKey,
	indexVal,
	streamedSoFar,
	// aggregateRewards,
	receivedSoFar,
}) => {
	const link = getAddressLink(contractAddress);
	const { web3, address } = useShallowSelector(selectMain);
	const [inputShow, setInputShow] = useState(false);
	const [value, setValue] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [lastDistribution, setLastDistribution] = useState<Date>();
	const [shareScaler, setShareScaler] = useState(1e3);
	const [isAffiliate, setIsAffiliate] = useState(false);
	const [userRewards, setUserRewards] = useState(0);
	const contract = getContract(rexReferralAddress, referralABI, web3);
	const [emissionRate, setEmissionRate] = useState('');
	const { t } = useTranslation();
	const personal_pool_rate = personalFlow ? personalFlow : 0;
	const total_market_pool = totalFlow ? totalFlow : 0;
	const subsidy_rate_static = emissionRate;
	const [aggregatedRewards, setAggregatedRewards] = useState<number[]>([]);
	const { aggregatedRICRewards } = useShallowSelector(selectMain);
	const dispatch = useDispatch();

	useEffect(() => {
		const subsidy_rate = (+personal_pool_rate / +total_market_pool) * 100;
		const received_reward = (+subsidy_rate / 100) * +subsidy_rate_static;
		if (received_reward !== undefined && +received_reward > 0) {
			setUserRewards(+received_reward.toFixed(2));
			let rewards = +received_reward;
			aggregatedRewards.push(rewards);
		}
	}, [personal_pool_rate, total_market_pool, subsidy_rate_static]);

	useEffect(() => {
		let aggregated = 0;
		aggregatedRewards.forEach((reward) => {
			aggregated = aggregated + reward;
		});

		if (aggregatedRICRewards && +aggregatedRICRewards !== aggregated) {
			dispatch(addReward(`${aggregated}`));
			aggregatedRewards.splice(0, aggregatedRewards.length);
			return;
		} else {
			console.log('skipped func');
			return;
		}
	}, [personal_pool_rate, total_market_pool, subsidy_rate_static]);

	useEffect(() => {
		setIsLoading(mainLoading);
	}, [mainLoading]);

	const contractAddressAllowed = (address: string) => {
		const eligibleAddresses = [
			'0x56aCA122d439365B455cECb14B4A39A9d1B54621',
			'0xE53dd10d49C8072d68d48c163d9e1A219bd6852D',
			'0xbB5C64B929b1E60c085dcDf88dfe41c6b9dcf65B',
			'0xF1748222B08193273fd34FF10A28352A2C25Adb0',
			'0x11Bfe0ff11819274F0FD57EFB4fc365800792D54',
			'0xB44B371A56cE0245ee961BB8b4a22568e3D32874',
			'0xF989C73d04D20c84d6A4D26d07090D0a63F021C7',
		];
		if (eligibleAddresses.includes(address)) {
			return true;
		} else {
			return false;
		}
	};
	useEffect(() => {
		let isMounted = true;

		if (address && contract) {
			(async () => {
				const affiliateStatus = await getAffiliateStatus(contract, address, web3);

				if (isMounted && affiliateStatus === AFFILIATE_STATUS.ENABLED) {
					setIsAffiliate(true);
				}
				if (contractAddressAllowed(contractAddress)) {
					const marketContract = getContract(contractAddress, streamExchangeABI, web3);

					marketContract.methods
						.getOutputPool(3)
						.call()
						.then((res: any) => {
							const finRate = ((Number(res.emissionRate) / 1e18) * 2592000).toFixed(4);
							setEmissionRate(finRate.toString());
						})
						.catch((error: any) => {
							console.log('error', error);
						});
				}
			})();
		}

		return () => {
			isMounted = false;
		};
	}, [address, contract, web3]);

	useEffect(() => {
		let isMounted = true;
		if (web3?.currentProvider === null || flowType !== FlowTypes.market) return;
		getShareScaler(web3, exchangeKey, tokenA, tokenB).then((res) => {
			if (isMounted) {
				setShareScaler(res);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [web3, exchangeKey, flowType, tokenA, tokenB]);

	useEffect(() => {
		let isMounted = true;
		if (web3?.currentProvider === null) return;
		getLastDistributionOnPair(web3, exchangeKey).then((p) => {
			if (isMounted) {
				setLastDistribution(p);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [web3, exchangeKey]);

	function getFormattedNumber(num: string) {
		return parseFloat(num)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	function getFlowUSDValue(flow: string, toFixed: number = 0) {
		return (parseFloat(flow as string) * coingeckoPrice).toFixed(toFixed);
	}

	const toggleInputShow = useCallback(() => {
		setInputShow(!inputShow);
	}, [inputShow, setInputShow]);

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		// @ts-ignore
		if (e.target.value < 0) {
			e.preventDefault();
		} else {
			setValue(e.target.value);
		}
	}, []);

	const callback = React.useCallback((e?: string) => {
		if (e) {
			showErrorToast(e, 'Error');
		}
		setIsLoading(false);
	}, []);

	const handleStart = useCallback(() => {
		if (isAffiliate) {
			showErrorToast('Affiliates can not stream', 'Error');
			return;
		}
		if (Number(balanceA) <= 0 || Number(value) < 0) {
			return;
		}
		setIsLoading(true);
		if (flowType === FlowTypes.market) {
			onClickStart(
				(
					((Math.floor(((parseFloat(value) / 2592000) * 1e18) / shareScaler) * shareScaler) / 1e18) *
					2592000
				).toString(),
				callback,
			);
		} else {
			onClickStart(value, callback);
		}
	}, [value, balanceA, flowType, isAffiliate, onClickStart, shareScaler, callback]);

	const handleStop = useCallback(() => {
		setIsLoading(true);
		onClickStop(callback);
	}, [callback, onClickStop]);

	// uncomment when need
	// const date = generateDate(balanceA, personalFlow);

	const fireIconsCheck = (coinA: string, coinB: string) => {
		if (
			(coinA === 'IbAlluoUSD' && coinB === 'IbAlluoETH') ||
			(coinA === 'USDC' && coinB === 'IbAlluoUSD') ||
			(coinA === 'IbAlluoUSD' && coinB === 'IbAlluoBTC') ||
			(coinA === 'USDC' && coinB === 'ETH') ||
			(coinA === 'USDC' && coinB === 'WBTC') ||
			(coinA === 'DAI' && coinB === 'ETH') ||
			(coinA === 'USDC' && coinB === 'MATIC')
		) {
			return true;
		}
		return false;
	};

	const uuid = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
	return (
		<>
			<section className={styles.panel}>
				<div className={styles.btn_arrow} onClick={toggleInputShow} role="presentation">
					<div className={styles.container}>
						<div className={styles.wrap}>
							{mainLoading ? (
								<span className={styles.stream}>
									<Skeleton height={50} width={200} />
								</span>
							) : (
								<div className={styles.row}>
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Price flowType={flowType} coinA={coinA} coinB={coinB} />
										<AddressLink addressLink={link} />
									</div>

									<div className={styles.coin}>
										<CoinChange nameCoinLeft={coinA} nameCoinRight={coinB} />
										{flowType === 'sushiLP' && <LpAPY contractAddress={contractAddress} />}
									</div>
								</div>
							)}

							{isLoading && !personalFlow ? (
								<span className={styles.stream}>
									<Skeleton count={2} width={140} />
								</span>
							) : (
								<div className={styles.stream}>
									<span>
										<span className={styles.number}>
											{`$${personalFlow && getFlowUSDValue(personalFlow)} ${t('per month')}`}
										</span>
									</span>
									<div>
										<span className={styles.token_amounts}>
											<span>{`${personalFlow && personalFlow} ${coinA}x / ${t('Month')}`}</span>
										</span>
									</div>
									{streamedSoFar && (
										<>
											<span
												className={styles.number}
												data-tip
												data-for={`streamed-so-far-${indexVal}`}
											>
												{`${t('Streamed')} ${streamedSoFar.toFixed(6)} ${coinA}x ${t(
													'so far',
												)}`}
											</span>
											<ReactTooltip
												id={`streamed-so-far-${indexVal}`}
												place="top"
												effect="solid"
												multiline
											>
												<span>
													{`${t('Streamed')} $${getFlowUSDValue(
														streamedSoFar.toString(),
														6,
													)} ${t('so far')}`}
												</span>
											</ReactTooltip>
										</>
									)}
									{receivedSoFar && (
										<>
											<span
												className={styles.number}
												data-tip
												data-for={`streamed-so-far-${indexVal}`}
											>
												{`${t('Received')} ${receivedSoFar.toFixed(6)} ${coinA}x ${t(
													'so far',
												)}`}
											</span>
											<ReactTooltip
												id={`streamed-so-far-${indexVal}`}
												place="top"
												effect="solid"
												multiline
											>
												<span>
													{`${t('Received')} $${getFlowUSDValue(
														receivedSoFar.toString(),
														6,
													)} ${t('so far')}`}
												</span>
											</ReactTooltip>
										</>
									)}
									<span>
										{(personalFlow || 0) > 0 && (balanceA || 0) > 0 && (
											<div className={styles.stream_values}>
												{`${t('Runs out on')} ${streamEnd}`}
											</div>
										)}
									</span>
								</div>
							)}
							{mainLoading ? (
								<span className={styles.stream}>
									<Skeleton count={2} width={140} />
								</span>
							) : (
								<div className={styles.balances}>
									<div className={styles.first_balance_container}>
										<CoinBalancePanel
											className={styles.currency_first_balance}
											name={coinA}
											balance={balanceA}
										/>
									</div>
									<CoinBalancePanel
										className={styles.currency_second_balance}
										name={coinB}
										balance={balanceB}
									/>
								</div>
							)}
							{mainLoading ? (
								<span className={styles.stream}>
									<Skeleton count={4} width={140} />
								</span>
							) : (
								<div className={styles.streaming}>
									<span>
										<span className={styles.number}>
											{`$${totalFlow && getFlowUSDValue(totalFlow)}`}
										</span>
										{t('per month')}
										{fireIconsCheck(coinA, coinB) ? (
											<span>
												<span
													data-tip
													data-for={`depositTooltipTotal-${uuid}`}
													style={{ marginLeft: '6px' }}
												>
													🔥
												</span>
												<ReactTooltip
													id={`depositTooltipTotal-${uuid}`}
													place="right"
													effect="solid"
													multiline
													className={styles.depositTooltip}
												>
													<span className={styles.depositTooltip_span}>
														Total rewards: {emissionRate} RIC/mo.
														<br />
														Your rewards: {userRewards} RIC/mo.
													</span>
												</ReactTooltip>
											</span>
										) : (
											<span />
										)}
									</span>
									<span className={styles.token_amounts}>
										<span>{`${totalFlow && totalFlow} ${coinA}x / ${t('Month')}`}</span>
									</span>
									<span>
										<span className={styles.number}>{totalFlows}</span>
										{t('total streams')}
									</span>
									<span className={styles.distributed_time}>
										{t('Distributed')}{' '}
										<b>{lastDistribution && <ReactTimeAgo date={lastDistribution} />}</b>
									</span>
								</div>
							)}
							{inputShow ? (
								<FontIcon name={FontIconName.ArrowUp} className={styles.arrow_up} />
							) : (
								<FontIcon name={FontIconName.ArrowDown} className={styles.arrow_down} />
							)}
						</div>
					</div>
				</div>
				{inputShow && personalFlow && (
					<div className={styles.form_mob}>
						<CoinRateForm
							placeholder={placeholder}
							value={value}
							onChange={handleChange}
							onClickStart={handleStart}
							onClickStop={handleStop}
							coin={coinA}
							isLoading={isLoading}
							isReadOnly={isReadOnly}
							shareScaler={shareScaler}
							personalFlow={getFormattedNumber(getFlowUSDValue(personalFlow))}
							indexVal={indexVal}
						/>
					</div>
				)}
				{inputShow && personalFlow && (
					<div className={styles.form}>
						<CoinRateForm
							placeholder={placeholder}
							value={value}
							onChange={handleChange}
							onClickStart={handleStart}
							onClickStop={handleStop}
							coin={coinA}
							isLoading={isLoading}
							isReadOnly={isReadOnly}
							personalFlow={getFormattedNumber(getFlowUSDValue(personalFlow))}
							shareScaler={shareScaler}
							indexVal={indexVal}
						/>
					</div>
				)}
			</section>
		</>
	);
};
