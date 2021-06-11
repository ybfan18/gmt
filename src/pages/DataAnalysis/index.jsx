import { Dropdown, message, Menu, Input, Tree, Spin, Pagination, AutoComplete, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { querySecuritiesInfo, queryRicLists, queryShareholderInfo } from './service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import moment from 'moment';
import { isEmpty, mimeType } from '@/utils/utils';
import CompanyInfo from './components/CompanyInfo';
import Executives from './components/Executives';
import EquityShareholders from './components/EquityShareholders';
import FinancialData from './components/FinancialData';
import ProfitForecast from './components/ProfitForecast';
import NewsNotice from './components/NewsNotice';

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

  let pageTotal = '共';
  let pageItems = '条';

  useEffect(() => {
    if (intl.locale === "zh-CN") {
      params.language = 'ZH';
      paramsList.language = 'ZH';
      pageTotal = '共';
      pageItems = '条';
    } else {
      params.language = 'EN';
      paramsList.language = 'EN';
      pageTotal = 'Total';
      pageItems = 'items';
    }
    securitiesInfo('')
    setLoadingState(false);
    setInfoTitle(menuList[0].name);

  }, []);

  //查询证券信息
  const securitiesInfo = (ric) => {
    params.ric = ric;
    setLoadingListState(true);
    querySecuritiesInfo(params).then(
      res => {
        if (res.state) {
          setLoadingListState(false);
          if (res.data) {
            setStateData(res.data);
          }
        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }

  //标题数据
  const menuList = [
    {
      id: 0,
      name: '概览'
    },
    {
      id: 1,
      name: '公司资料&证券资料',
      subMenu: [
        {
          id: 101,
          name: '公司介绍'
        },
        {
          id: 102,
          name: '董事会高管'
        },
        {
          id: 103,
          name: '股票详情'
        }
      ]
    },
    {
      id: 2,
      name: '新闻公告&研究报告',
      nameEN: 'Press Announcements & Research Reports'
    },
    {
      id: 3,
      name: '股本股东',
      subMenu: [
        {
          id: 301,
          name: '股东报告',
          type: 'Consolidated'
        },
        {
          id: 302,
          name: '基金持仓',
          type: 'Fund'
        },
      ]
    },
    {
      id: 4,
      name: '盈利预测&研究报告'
    },
    {
      id: 5,
      name: '交易&估值'
    },
    {
      id: 6,
      name: '财务数据',
      subMenu: [
        {
          id: 601,
          name: '成长能力',
        },
        {
          id: 602,
          name: '现金流量',
        },
        {
          id: 603,
          name: '损益表'
        },
        {
          id: 604,
          name: '资产负债表'
        },
        {
          id: 605,
          name: '盈利能力与收益质量',
        },
        {
          id: 606,
          name: '营运能力',
        },
        {
          id: 607,
          name: '主营构成',
        },
        {
          id: 608,
          name: '资本结构与偿债能力',
        },
      ]
    },
    {
      id: 7,
      name: '重大事件'
    },
    {
      id: 8,
      name: '同行比较'
    },
  ]

  const [one, setOne] = useState(0);
  const [twoMenu, setTwoMenu] = useState([]);
  //点击查看相关信息
  const checkInfo = (item) => {
    setOne(item.id);
    if (item.subMenu) {
      setTwoMenu(item.subMenu);
    }else{
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

  const [ricState, setRicState] = useState({});//ric码
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
    setRicState(e);
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

  return (
    <PageContainer loading={loadingState} className={styles.securitiesInfo}>
      <div className={styles.inputDiv}>
        <AutoComplete className={styles.searchInput}
          onChange={(e) => queryRicListData(e)}
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
      {(infoKey != 301 && infoKey != 302 && infoKey != 601 && infoKey != 602 && infoKey != 603 && infoKey != 604) ?
        <div className={styles.companyInfo}>
          <div className={styles.infoTitle}>
            <span className={styles.titleTxt}>{infoTitle}</span>
          </div>
          <div>
            {
              (infoKey == 101 || infoKey == 103) ?
                stateData.GetGeneralInformation_Response_1 ?
                  <CompanyInfo allData={stateData} keyType={infoKey} /> :
                  <Spin className={styles.spinLoading} /> :
                infoKey == 102 ?
                  stateData.GetGeneralInformation_Response_1 ?
                    <Executives allData={stateData} /> :
                    <Spin className={styles.spinLoading} /> :
                  infoKey == 2 ?
                    <NewsNotice /> :
                    ''
            }
          </div>
        </div> : ''
      }
      {(infoKey == 301 || infoKey == 302) ?
        <div>
          <EquityShareholders keyType={infoKey} ric={ricState} />
        </div>
        : infoKey == 601 || infoKey == 602 || infoKey == 603 || infoKey == 604 ?
          <div>
            <FinancialData keyType={infoKey} />
          </div>
          :
          infoKey == 501 ?
            <ProfitForecast /> :
            ''
      }

    </PageContainer>
  )
};

export default DataAnalysis;
