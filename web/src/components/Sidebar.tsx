import { useContext } from "react";
import appContext from "../stores/appContext";
import utils from "../helpers/utils";
import showDailyMemoDiaryDialog from "./DailyMemoDiaryDialog";
import showSettingDialog from "./SettingDialog";
import showMemoTrashDialog from "./MemoTrashDialog";
import UserBanner from "./UserBanner";
import ShortcutList from "./ShortcutList";
import UsageHeatMap from "./UsageHeatMap";
import "../less/siderbar.less";

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const {
    memoState: { memos, tags },
    userState: { user },
  } = useContext(appContext);
  const createdDays = user ? Math.ceil((Date.now() - utils.getTimeStampByDate(user.createdAt)) / 1000 / 3600 / 24) : 0;

  const handleMyAccountBtnClick = () => {
    showSettingDialog();
  };

  const handleMemosTrashBtnClick = () => {
    showMemoTrashDialog();
  };

  return (
    <aside className="sidebar-wrapper">
      <UserBanner />
      <div className="status-text-container">
        <div className="status-text memos-text">
          <span className="amount-text">{memos.length}</span>
          <span className="type-text">MEMO</span>
        </div>
        <div className="status-text tags-text">
          <span className="amount-text">{tags.length}</span>
          <span className="type-text">TAG</span>
        </div>
        <div className="status-text duration-text" onClick={() => showDailyMemoDiaryDialog()}>
          <span className="amount-text">{createdDays}</span>
          <span className="type-text">DAY</span>
        </div>
      </div>
      <UsageHeatMap />
      <div className="action-btns-container">
        <button className="btn action-btn" onClick={handleMyAccountBtnClick}>
          <span className="icon">👤</span> Setting
        </button>
        <button className="btn action-btn" onClick={handleMemosTrashBtnClick}>
          <span className="icon">🗑️</span> Recycle Bin
        </button>
      </div>
      <ShortcutList />
    </aside>
  );
};

export default Sidebar;
