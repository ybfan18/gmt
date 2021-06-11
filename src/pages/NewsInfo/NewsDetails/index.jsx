import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { queryNewsInfo } from '../FinancialNews/service';
import { getAuthority } from '@/utils/authority';
import styles from './index.less';
import moment from 'moment';

const NewsDetails = (props) => {
  const userInfo = getAuthority();//获取用户相关信息
  let { newsId } = props.match.params;
  const [loadingState, setLoadingState] = useState(true);//loading
  /** 国际化配置 */
  const intl = useIntl();
  
  let params = {
    newsId: newsId,
    accessToken: userInfo.accessToken
  }

  //新闻详情
  const [newsInfo, setNewsInfo] = useState({});

  //parentId
  useEffect(() => {
    queryNewsInfo(params).then(
      res => {
        setLoadingState(false);
        if (res.state) {
          if (res.data && res.data.RetrieveStoryML_Response_1.StoryMLResponse.STORYML.HL.length > 0) {
            setNewsInfo(res.data.RetrieveStoryML_Response_1.StoryMLResponse.STORYML.HL[0]);
          }
        } else {
          setLoadingState(false);
          message.error(res.message);
        }
      }
    );
  }, []);


  return (
    <PageContainer loading={loadingState}>
      <div >
        <div className={styles.infoTime}>{moment(newsInfo.CT).format("yyyy-MM-DD HH:mm:ss")}</div>
        <div className={styles.infoTitle}>{newsInfo.HT}</div>
        <div className={styles.infoTxt} dangerouslySetInnerHTML={{__html: newsInfo.TE}}></div>

      </div>
    </PageContainer>
  )
};

export default connect(({ loading }) => ({
  loading:loading
}))(NewsDetails);