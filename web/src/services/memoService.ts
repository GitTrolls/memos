import * as api from "../helpers/api";
import { createMemo, patchMemo, setMemos, setTags } from "../store/modules/memo";
import store from "../store";
import { getUserIdFromPath } from "./userService";

const convertResponseModelMemo = (memo: Memo): Memo => {
  return {
    ...memo,
    createdTs: memo.createdTs * 1000,
    updatedTs: memo.updatedTs * 1000,
  };
};

const memoService = {
  getState: () => {
    return store.getState().memo;
  },

  fetchAllMemos: async () => {
    const { data } = (await api.getMemoList(getUserIdFromPath())).data;
    const memos = data.filter((m) => m.rowStatus !== "ARCHIVED").map((m) => convertResponseModelMemo(m));
    store.dispatch(setMemos(memos));

    return memos;
  },

  fetchArchivedMemos: async () => {
    const { data } = (await api.getArchivedMemoList(getUserIdFromPath())).data;
    const archivedMemos = data.map((m) => {
      return convertResponseModelMemo(m);
    });
    return archivedMemos;
  },

  getMemoById: (memoId: MemoId) => {
    for (const m of memoService.getState().memos) {
      if (m.id === memoId) {
        return m;
      }
    }

    return null;
  },

  updateTagsState: async () => {
    const { data } = (await api.getTagList(getUserIdFromPath())).data;
    store.dispatch(setTags(data));
  },

  getLinkedMemos: async (memoId: MemoId): Promise<Memo[]> => {
    const { memos } = memoService.getState();
    const regex = new RegExp(`[@(.+?)](${memoId})`);
    return memos.filter((m) => m.content.match(regex));
  },

  createMemo: async (memoCreate: MemoCreate) => {
    const { data } = (await api.createMemo(memoCreate)).data;
    const memo = convertResponseModelMemo(data);
    store.dispatch(createMemo(memo));
  },

  patchMemo: async (memoPatch: MemoPatch): Promise<Memo> => {
    const { data } = (await api.patchMemo(memoPatch)).data;
    const memo = convertResponseModelMemo(data);
    store.dispatch(patchMemo(memo));
    return memo;
  },

  pinMemo: async (memoId: MemoId) => {
    await api.pinMemo(memoId);
    store.dispatch(
      patchMemo({
        id: memoId,
        pinned: true,
      })
    );
  },

  unpinMemo: async (memoId: MemoId) => {
    await api.unpinMemo(memoId);
    store.dispatch(
      patchMemo({
        id: memoId,
        pinned: false,
      })
    );
  },

  deleteMemoById: async (memoId: MemoId) => {
    await api.deleteMemo(memoId);
  },
};

export default memoService;
