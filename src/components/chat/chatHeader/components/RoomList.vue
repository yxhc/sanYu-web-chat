<template>
    <div class="online">
        <div v-if="!createRoomVisible">
            <div v-for="(item, index) in room_list" :key="index" :class="['online-item',
                { official: item.room_id == 888 },
                ,
                { current: item.room_id == room_id },]" @click="handleJoinRoom(item)">
                <img class="online-item-avatar" :src="item.room_logo" />
                <icon v-if="Number(item.room_id) === room_id" name="chat-room-info-select" scale="2.6" class="mine-room" />
                <div class="online-item-info">
                    <div class="online-item-info-name">
                        <span>{{ item.room_name }}</span>
                        <span v-if="item.room_id == 888" class="role hall">官方大厅</span>
                    </div>
                </div>
            </div>

        </div>
        <el-dialog title="更改房间提醒" :visible.sync="showJoinModal" width="320px" top="35vh" append-to-body>
            <span>是否退出当前房间并加入新的房间？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="showJoinModal = false">我再想想</el-button>
                <el-button type="primary" size="mini" @click="handlerConfirm">确认加入</el-button>
            </span>
        </el-dialog>

        <div v-if="createRoomVisible" class="create">
            <el-form ref="form" label-position="left" label-width="80px" :rules="rules" :model="ruleform" size="mini">
                <el-form-item label="房间名称" prop="room_name">
                    <el-input v-model="ruleform.room_name" placeholder="请设置您的房间名称"></el-input>
                </el-form-item>
                <el-form-item label="房间号码" prop="room_id">
                    <el-input v-model="ruleform.room_id" placeholder="请设置您的房间ID"></el-input>
                </el-form-item>
                <el-form-item label="是否加密" prop="room_need_password">
                    <el-select v-model="ruleform.room_need_password" style="width: 100%" placeholder="请选择房间是否加密">
                        <el-option label="加密" :value="1"></el-option>
                        <el-option label="不加密" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="Number(ruleform.room_need_password)" label="房间密码" prop="room_password">
                    <el-input v-model="ruleform.room_password" placeholder="请设置您的房间密码"></el-input>
                </el-form-item>
                <el-form-item label="房间公告" prop="room_notice">
                    <el-input v-model="ruleform.room_notice" type="textarea" :rows="3"
                        placeholder="请设置您的房间公告 英文,为换行"></el-input>
                </el-form-item>
                <div class="create-footer">
                    <el-button style="float: right" type="info" size="mini" @click="$emit('cancel')">取消创建</el-button>
                    <el-button style="float: right" type="primary" size="mini" @click="createRoom()">创建房间</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { createRoom } from '@/api/chat';
export default {
    name: "RoomInfo",
    props: {
        createRoomVisible: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            showJoinModal: false,
            activeRoomId: null,
            ruleform: {
                room_id: null,
                room_name: null,
                room_notice: null,
                room_need_password: null,
                room_logo: null,
            },
            rules: {
                room_id: [
                    { required: true, message: "请设置您的房间ID", trigger: "blur" },
                    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
                ],
                room_name: [
                    { required: true, message: "请设置您的房间名称", trigger: "blur" },
                    { min: 4, max: 8, message: "长度在 4 到 8 个字符", trigger: "blur" },
                ],
                room_notice: [
                    { required: true, message: "请设置您的房间公告", trigger: "blur" },
                    { max: 520, message: "长度最长520字符", trigger: "blur" },
                ],
                room_need_password: [
                    {
                        required: true,
                        message: "请设置房间是否需要密码",
                        trigger: "change",
                    },
                ],
                room_password: [
                    { required: true, message: "请设置房间密码", trigger: "change" },
                    { min: 3, max: 9, message: "长度在 3 到 9 个字符", trigger: "blur" },
                ],
            },
        };
    },
    computed: {
        ...mapGetters(["room_list", "room_id", "mine_room_id"])
    },
    methods: {
        ...mapMutations([
            "setRoomId"
        ]),
        handleJoinRoom(room) {
            const { room_id } = room;
            if (Number(room_id) === Number(this.room_id)) {
                return this.$message.warning("已经在当前房间了");
            }
            this.activeRoomId = Number(room_id);
            this.showJoinModal = true;
        },
        //确认加入其他房间
        handlerConfirm() {
            this.setRoomId(Number(this.activeRoomId));
            this.$emit("close");
        },

        async createRoom() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                const { success } = await createRoom(this.ruleform);
                success && this.$emit("create-success");
            });
        },
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
        transition: all 0.3s;
        border-left: 3px solid transparent;
        padding-left: 8px;
        position: relative;

        .mine-room {
            position: absolute;
            top: 5px;
            left: 0;
        }

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

                .role {
                    background-color: #ccc;
                    font-size: 12px;
                    color: #fff;
                    padding: 1px 10px;
                    margin-right: 3px;
                    border-radius: 3px;
                }

                .hall {
                    background: #000;
                    color: #fff;
                }
            }
        }

        .official {
            border-bottom: 3px solid @message-border-color;
            border-top: 1px solid @message-border-color;
            margin-bottom: 15px;
        }

        .current {
            border-right: 3px solid #521cd373;
        }

        .create {
            transition: all 0.3s;
            padding: 10px 20px;

            .create-footer {
                display: flex;
                margin-left: 80px;
            }
        }
    }
}
</style>