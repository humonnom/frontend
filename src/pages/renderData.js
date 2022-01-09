import axios from 'axios';
import { useDispatch } from 'react-redux';
import { convertForRedux } from '../utils/convert';
import { createReplacementWidgetsAction } from '../redux/slice';

function renderData(user_seq) {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('access_token');

  const setWidgetState = async (data) => {
    console.log(data);
    const convertedForRedux = await convertForRedux(data);
    dispatch(
      createReplacementWidgetsAction({
        count: convertedForRedux.length,
        list: convertedForRedux,
      })
    );
  };

  const getWidgetsDataFromServer = async () => {
    const endPoint = `http://${process.env.REACT_APP_SERVER_DOMAIN}/user/${user_seq}/edit`;
    await axios
      .get(endPoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.code === 401 || res.data.code === 601) {
          window.location.assign(`/${user_seq}/auth/token/refresh`);
        } else if (res.data.code === 419) {
          window.location.assign(`/${user_seq}/auth/token/refresh`);
        }
        setWidgetState(res.data.widget_list);
      })
      .catch((res) => {
        console.log(res.data.code);
        window.location.assign(`/${user_seq}/auth/token/refresh`);
      });
  };

  getWidgetsDataFromServer();
}

export default renderData;
