<template>
    <div v-if="music_info" class="progress">
        <div class="bar" :style="{ width: `${width}%` }"></div>

        <div class="current-music">
            <icon name="progress-music" class="icon" scale="1.8" />
            <span class="music-album">
                {{ music_info.music_album }} -
                {{ music_info.music_singer }}
            </span>
        </div>
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
        ...mapState(["current_music_time", "music_info"]),
        width() {
            if (!this.current_music_time || !this.music_info) return 0;
            const { music_duration } = this.music_info;
            const width = (
                (Number(this.current_music_time) / Number(music_duration)) *
                100
            ).toFixed(2);
            return width > 100 ? 100 : width;
        },
    }
}
</script>
<style lang="less" scoped>
@media screen and (max-width: 820px) {
    .current-music {
        top: -20px !important;
    }
}

.progress {
    height: 2px;
    width: 100%;
    background: @message-border-color;
    position: relative;

    .bar {
        height: 2px;
        background: linear-gradient(270deg, #4493d7, #fff);
    }

    .current-music {
        position: absolute;
        right: 0;
        height: 5px;
        top: 20px;
        display: flex;
        align-items: center;
        color: #999;
        user-select: none;
        z-index: 3;

        .music-album {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 300px;
        }

        .icon {
            transition: all 0.3s;
            margin-right: 5px;
            cursor: pointer;

            &:nth-child(2) {
                margin-left: 5px;

                &:hover {
                    color: #409eff;
                }
            }

            &:nth-child(3) {
                &:hover {
                    color: #ff4500;
                }
            }

            &:active {
                transform: scale(1.2);
            }
        }
    }
}</style>