<template>
    <div class="toolbar">
        <div class="toolbar-left">
            <div class="toolbar-left-item flex_center">
                <icon name="toolbar-pic " scale="1.6" class="m_r5" />
                表情
            </div>
            <div class="toolbar-left-item flex_center">
                <icon name="toolbar-music" class="m_r5" scale="1.6" />
                点歌
            </div>
            <div class="toolbar-left-item flex_center">
                <icon name="toolbar-hook" class="m_r5" scale="1.6" />
                已点
            </div>
            <div class="toolbar-left-item flex_center">
                <icon name="toolbar-love" class="m_r5" scale="1.6" />
                收藏
            </div>
        </div>
        <div class="toolbar-right"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
}
</script>
<style lang="less" scoped>
.toolbar {
    position: relative;
    display: flex;
    justify-content: space-between;
    color: #999;
    padding: 3px 0;

    .active-menu {
        background: @message-hover-bg-color !important;
    }

    &-left {
        display: flex;

        &-item {
            user-select: none;
            margin-right: 5px;
            padding: 5px 10px;
            border-radius: 5px;
            transition: all 0.3s;
            cursor: pointer;
            position: relative;

            &:nth-child(1) {
                margin-left: 15px;
            }

            &:hover {
                background: @message-hover-bg-color;
            }

            .wx-container {
                position: absolute;
                bottom: 50px;
            }
        }

        .icon {
            margin-right: 4px;
        }
    }
}
</style>