<template>
    <div class="online">
        <div v-for="(item, index) in on_line_user_list " :key="index" :class="['online-item', { current: mine(item.id) }]">
            <img class="online-item-avatar" :src="item && item.avatar" />
            <div class="online-item-info">
                <div class="online-item-info-name">
                    <span>{{ item.nickname }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'OnLineInfo',
    data() {
        return {

        }
    },

    computed: {
        ...mapGetters([
            "on_line_user_list",
            "room_admin_id",
            "mine_id"
        ]),
        mine() {
            return (id) => this.mine_id === id
        }
    }
}

</script>

<style lang="less" scoped>
.online {
    display: flex;
    flex-direction: column;
    height: 440px;
    overflow: hidden;
    overflow-y: auto;

    &-item {
        cursor: pointer;
        padding: 10px;
        display: flex;
        align-items: center;
        border-top: 1px solid @message-border-color;
        transition: all 0.3s;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        padding-left: 8px;
        position: relative;

        &:hover {
            border-left: 3px solid #1295dd;
        }

        &-avatar {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            margin-right: 10px;
        }

        &-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            width: 0;

            &-name {
                font-size: 14px;
                color: @message-main-text-color;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
}
</style>