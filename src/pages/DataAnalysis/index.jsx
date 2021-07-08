import { Dropdown, message, Menu, Spin, AutoComplete } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { querySecuritiesInfo, queryRicLists } from './service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import moment from 'moment';
import { isEmpty, mimeType } from '@/utils/utils';
import CompanyInfo from './components/CompanyInfo';
import Executives from './components/Executives';
import EquityShareholders from './components/EquityShareholders';
import FinancialData from './components/FinancialData';
import ProfitForecast from './components/ProfitForecast';
import ProfitForecastReport from './components/ProfitForecastReport';
import NewsNotice from './components/NewsNotice';
import TradingValuation from './components/TradingValuation';
import PeerComparison from './components/PeerComparison';
import { menuList } from './components/DataUtil';
import SignificantEvent from './components/SignificantEvent';

const { Option } = AutoComplete;
const DataAnalysis = () => {

  const userInfo = getAuthority();//获取用户相关信息
  //默认ric
  let params = {
    ric: '',
    accessToken: userInfo.accessToken
  }
  const [loadingState, setLoadingState] = useState(true);//loading
  const [stateData, setStateData] = useState({});
  const [loadingListState, setLoadingListState] = useState(true);//list loading

  /** 国际化配置 */
  const intl = useIntl();

  //查询公告列表参数
  let paramsList = {
    accessToken: userInfo.accessToken,
    language: "ZH"
  };


  useEffect(() => {
    if (intl.locale === "zh-CN") {
      params.language = 'ZH';
      paramsList.language = 'ZH';
    } else {
      params.language = 'EN';
      paramsList.language = 'EN';
    }
    securitiesInfo('')
    setInfoTitle(menuList[0].name);

  }, []);

  //查询证券信息
  const securitiesInfo = (ric) => {
    params.ric = ric;
    setLoadingListState(true)
    querySecuritiesInfo(params).then(
      res => {
        if (res.state) {
          setLoadingState(false);
          setLoadingListState(false)
          if (res.data) {
            setStateData(res.data);
          }
        } else {
          setLoadingState(false);
          setLoadingListState(false)
          message.error(res.message);
        }
      }
    );
  }

  const [one, setOne] = useState(0);
  const [twoMenu, setTwoMenu] = useState([]);
  //点击查看相关信息
  const checkInfo = (item) => {
    setOne(item.id);
    if (item.subMenu) {
      setTwoMenu(item.subMenu);
    } else {
      setInfoKey(item.id);
      setInfoTitle(item.name);
    }
  }

  const [infoTitle, setInfoTitle] = useState('');//二级分类信息头
  const [infoKey, setInfoKey] = useState(0);//判断显示类别
  //通过二级分类切换相关信息
  const getTwoMenu = ({ item, key }) => {
    setInfoKey(key);
    setInfoTitle(item.node.innerText);
  }

  //装载二级目录
  const menu = (
    <Menu onClick={getTwoMenu}>
      {twoMenu ? twoMenu.map((item) => (
        <Menu.Item key={item.id}>{item.name}</Menu.Item>
      )) : ''}
    </Menu>
  );

  const [ricState, setRicState] = useState('');//ric码
  //ric码查询结果
  const [ricList, setRicList] = useState([]);
  let ricParams = {
    ric: '',
    pageSize: 10,
    page: 1,
    accessToken: userInfo.accessToken,
  }

  //模糊查询ric集合
  const queryRicListData = (e) => {
    ricParams.ric = e;
    queryRicLists(ricParams).then(
      res => {
        if (res.state) {
          if (res.data && res.data.result && res.data.result.length > 0) {
            setRicList(res.data.result)
          }
        } else {
          message.error(res.message);
        }
      }
    );
  }
  //选择完成赋值ric
  const getRicValue = (e) => {
    setRicState(e);
    securitiesInfo(e);
  }

  return (
    <PageContainer loading={loadingState} className={styles.securitiesInfo}>
      <div className={styles.inputDiv}>
        <span className={styles.pageTitle}>
          {stateData.GetShareholdersReport_Response_1 ?
            stateData.GetShareholdersReport_Response_1.SymbolReport ?
              stateData.GetShareholdersReport_Response_1.SymbolReport.Identifiers ?
                stateData.GetShareholdersReport_Response_1.SymbolReport.Identifiers.Identifier.length > 0 ?
                  stateData.GetShareholdersReport_Response_1.SymbolReport.Identifiers.Identifier.map((idt) => (
                    idt.Symbol === 'TickerSymbol' ? idt.Value : ''
                  )) : '' : '' : '' : ''
          }
        </span>
        <AutoComplete className={styles.searchInput}
          onChange={(e) => queryRicListData(e)}
          onSelect={(e) => getRicValue(e)}
          name='code'
          style={{ marginTop: '-2px' }}
          placeholder={intl.formatMessage({
            id: 'pages.companyNotice.code',
            defaultMessage: '输入代码',
          })} >
          {ricList.length > 0 ? ricList.map((ric, index) => (
            <Option key={index} value={ric.ric}>
              {ric.ric}
            </Option>
          )) : ''}
        </AutoComplete>
      </div>
      <div className={styles.securitiesTitle}>
        {menuList ? menuList.map((item) => (
          item.subMenu ?
            <Dropdown overlay={menu} key={item.id}>
              <span onMouseOver={() => checkInfo(item)}
                className={[styles.oneSpan, item.id === one ? styles.oneActive : ''].join(' ')}>
                {item.name}
              </span>
            </Dropdown>
            :
            <span onClick={() => checkInfo(item)}
              key={item.id}
              className={[styles.oneSpan, item.id === one ? styles.oneActive : ''].join(' ')}>
              {item.name}
            </span>
        )) : ''}
      </div>
      {!loadingListState ?
        <div>
          {
            (infoKey == 101 || infoKey == 103) ?
              stateData.GetGeneralInformation_Response_1 ?
                <CompanyInfo allData={stateData} keyType={infoKey} /> :
                <Spin className={styles.spinLoading} /> :
              infoKey == 102 ?
                stateData.GetGeneralInformation_Response_1 ?
                  <Executives allData={stateData} keyType={infoKey} /> :
                  <Spin className={styles.spinLoading} /> :
                infoKey == 2 ?
                  <NewsNotice keyType={infoKey} ric={ricState} /> :
                  (infoKey == 301 || infoKey == 302) ?
                    <div>
                      <EquityShareholders keyType={infoKey} ric={ricState} />
                    </div>
                    : (infoKey == 601 || infoKey == 602 || infoKey == 603 || infoKey == 604 || infoKey == 605 || infoKey == 606 || infoKey == 608) ?
                      <div>
                        <FinancialData keyType={infoKey} ric={ricState} />
                      </div>
                      :
                      (infoKey == 401 || infoKey == 402 || infoKey == 403) ?
                        <ProfitForecast keyType={infoKey} ric={ricState} /> :
                        infoKey == 404 ?
                          <ProfitForecastReport keyType={infoKey} ric={ricState} /> :
                          (infoKey == 501 || infoKey == 502) ?
                            <TradingValuation keyType={infoKey} ric={ricState} /> :
                            (infoKey == 801) ?
                              <PeerComparison keyType={infoKey} ric={ricState} /> :
                              (infoKey == 701 || infoKey == 702) ?
                                <SignificantEvent keyType={infoKey} ric={ricState} /> :
                                ''
          }
        </div> :
        <Spin className={styles.spinLoading} />}

    </PageContainer>
  )
};

export default DataAnalysis;
