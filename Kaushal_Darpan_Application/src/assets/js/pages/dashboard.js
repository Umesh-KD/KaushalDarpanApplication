/*
 Template Name: FlexAdmin - Admin & Dashboard Template
 Author: MyraStudio
 File: Dashboard
*/

$(function () {
    'use strict';
    if ($("#morris-bar-example").length) {
        Morris.Bar({
            element: 'morris-bar-example',
            barColors: ['#346ee0', '#20b799', '#c7c9cb'],
            data: [{
                y: '2024-25',
                a: 80,
                b: 90,
                c: 100
            },
                {
                    y: '2023-24',
                    a: 110,
                    b: 70,
                    c: 130
                },
                {
                    y: '2022-23',
                    a: 90,
                    b: 60,
                    c: 110
                },
                {
                    y: '2021-22',
                    a: 120,
                    b: 80,
                    c: 140
                },
                {
                    y: '2020-21',
                    a: 110,
                    b: 100,
                    c: 125
                },
                {
                    y: '2019-20',
                    a: 170,
                    b: 120,
                    c: 190
                },
                {
                    y: '2018-19',
                    a: 120,
                    b: 90,
                    c: 140
                }
            ],
            xkey: 'y',
            ykeys: ['a', 'b', 'c'],
            hideHover: 'auto',
            labels: ['Engineering', 'Non - Engineering', 'Lateral'],
            gridLineColor: '#eef0f2',
            resize: true,
            barSizeRatio: 0.4
        });
    }



    if ($("#morris-donut-example").length) {
        Morris.Donut({
            element: 'morris-donut-example',
            resize: true,
            backgroundColor: 'transparent',
            colors: ['#20b799', '#346ee0', '#e9ecef'],
            data: [{
                label: "Male",
                value: 1500
            },
            {
                label: "Female",
                value: 2000
            },
            {
                label: "Other",
                value: 10
            }
            ]
        });
    }

    if ($('#morris-line-example').length) {
        Morris.Line({
            element: 'morris-line-example',
            gridLineColor: '#eef0f2',
            lineColors: ['#346ee0', '#20b799', '#c7c9cb'],
            data: [{
                y: '2024-25',
                a: 80,
                b: 90,
                c: 100
            },
            {
                y: '2023-24',
                a: 110,
                b: 70,
                c: 130
            },
            {
                y: '2022-23',
                a: 90,
                b: 60,
                c: 110
            },
            {
                y: '2021-22',
                a: 120,
                b: 80,
                c: 140
            },
            {
                y: '2020-21',
                a: 110,
                b: 100,
                c: 125
            },
            {
                y: '2019-20',
                a: 170,
                b: 120,
                c: 190
            },
            {
                y: '2018-19',
                a: 120,
                b: 90,
                c: 140
            }
            ],
            xkey: 'y',
            ykeys: ['a', 'b', 'c'],
            hideHover: 'auto',
            resize: true,
            labels: ['Engineering', 'Non - Engineering', 'Lateral']
        });
    }
});