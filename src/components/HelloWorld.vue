<template>
    <v-container>
        <v-layout
                text-xs-center
                wrap
        >
            <table class="w-100" v-if="list.length">
                <thead>
                <tr>
                    <td class="blue lighten-4 py-1 w-50">Opportunity</td>
                    <td class="blue lighten-4 py-1 w-50">Times</td>
                </tr>
                </thead>
                <tbody class="px-2">
                <tr v-for="(item, index) in list" :key="index">
                    <td xs-12 class="py-1 w-50 text-xs-left">
                        {{ index + 1 }}. {{ item.title}}
                    </td>
                    <td xs-12 class="py-1 w-50 text-xs-right">
                        <span class="progress red"
                              v-bind:style="{width: calculateWidth(item.time)}"
                        ></span>
                        <span class="time">
                            {{item.time / 1000}} ms
                        </span>
                    </td>
                </tr>
                </tbody>
            </table>

            <v-flex xs12>
                <v-img
                        :src="require('../assets/logo.svg')"
                        class="my-3"
                        contain
                        height="200"
                ></v-img>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';

    export default {
        data: () => ({
            list: [],
            maxTime: 0,
            minTime: 0
        }),
        mounted() {
            axios('/audit?site=https://habr.com/')
                .then(res => {
                    let data = res.data;
                    if (data.length) {
                        this.maxTime = data[0].time;
                        this.minTime = data[data.length - 1].time;
                        this.list = res.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        methods: {
            calculateWidth: function (time) {
                let res = time * 100 / this.maxTime;

                return res > 85 ? `${res - 15}%` : `${res}%`;
            }
        }
    }
</script>

<style>
    .w-50 {
        width: 50%;
    }

    .w-100 {
        width: 100%;
    }

    .time {
        display: inline-block;
        min-width: 80px;
    }

    .progress {
        display: inline-block;
        height: 5px;
    }
</style>
