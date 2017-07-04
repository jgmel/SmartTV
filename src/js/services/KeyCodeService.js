/**
 * Created by strobil on 19.06.17.
 */

app.service('KeyCodeService', function (DeviceService) {
    
    var Keys = {};

    Keys.VK_ArrowLeft = 37;
    Keys.VK_ArrowUp = 38;
    Keys.VK_ArrowRight = 39;
    Keys.VK_ArrowDown = 40;

    Keys.VK_Enter = 13;

    Keys.VK_VolumeUp = 447;
    Keys.VK_VolumeDown = 448;

    Keys.VK_VolumeMute = 449;

    Keys.VK_ChannelUp = 427;
    Keys.VK_ChannelDown = 428;

    Keys.VK_ColorF0Red = 403;
    Keys.VK_ColorF1Green = 404;
    Keys.VK_ColorF2Yellow = 405;
    Keys.VK_ColorF3Blue = 406;

    Keys.VK_Info = 457;
    Keys.VK_Exit = 10182;
    Keys.VK_Caption = 10221;
    Keys.VK_ChannelList = 10073;
    Keys.VK_EManual = 10146;
    Keys.VK_3D = 10199;

    Keys.VK_0 = 48;
    Keys.VK_1 = 49;
    Keys.VK_2 = 50;
    Keys.VK_3 = 51;
    Keys.VK_4 = 52;
    Keys.VK_5 = 53;
    Keys.VK_6 = 54;
    Keys.VK_7 = 55;
    Keys.VK_8 = 56;
    Keys.VK_9 = 57;
    
    function Init() {
        switch (DeviceService.sub_type()) {
            case "DST_SAMSUNG":
                Keys.VK_Return = 10009;
                break;
            case "DST_LG":
                Keys.VK_Return = 461;
                Keys.VK_Play = 415;
                Keys.VK_Pause = 19;
                Keys.VK_FF_FW = 417;
                Keys.VK_FF_RW = 412;
                Keys.VK_Stop = 413;
                break;
            case "DST_BROWSER":
                Keys.VK_Return = 8;
                break;
        }
    }

    Init();

    return Keys;
});
