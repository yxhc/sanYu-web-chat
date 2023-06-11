<template>
    <div class="lrc s-1-line">
        <span class="lrc-text">
            <icon name="music" class="icon" scale="1.6" />
            {{ lrc || '歌词正在加载中' }}
        </span>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapState([
            "current_music_time",
            "music_lrc"
        ]),
        lrc() {
            if (!this.music_lrc) return;
            const res = this.music_lrc.filter(
                (t) => t.time < this.current_music_time
            );
            return res.length && res[res.length - 1].lineLyric;
        }
    }
}
</script>
<style lang="less" scoped>
.lrc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 5px 15px;
    overflow: hidden;
    color: #999;

    &-text {
        flex: 1;
    }

    .icon {
        margin-right: 5px;
    }
}
</style>