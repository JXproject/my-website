// memorize last choice:
var G_sidebar_selected_tags =
    {
        about: "All",
        blog: "All_Blogs",
        proj: "All",
        photo: "All",
        contact: "All",
        current: "All"
    };//by default to show all projects

var G_context_status =
    {
        side_bar_visible: true
    };

var G_PAGE_REFERENCE = ["#page-about", "#page-blog", "#page-projects", "#page-photography", "#page-contact"];

/*----------------------------------------------------*/
/* Json helper functions
------------------------------------------------------ */
//find item index in json list
function indexOfItemInJSON (_item_name, _item_val, _json_list){
    return _json_list.findIndex(function(__item, _i){
        return __item[_item_name]===_item_val;
    });
}

// sorting
function sortResults(j_arr, prop, asc) {
    return j_arr.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]);
        else return (b[prop] > a[prop]);
    });
}


//convert space to '_'
function c_S(content){
    return content.replace(/ /g, "_");
}

//convert '/' to '-'
function c_D(content){
    return content.replace(/\//g, "-");
}

/*----------------------------------------------------*/
/* cards filter selection
------------------------------------------------------ */
function disp_cards_by(list_, list_filtered_, tag_, div_id_, cards_category_){
    // console.log(tag_);
    if(!list_)
        return false;
    if(!tag_.includes("All"))
    {
        list_filtered_ = list_.filter(function (item,n){
            return (item.tags.indexOf(tag_) > -1);
        });
    }else
        list_filtered_ = list_;
    //regen cards
    gen_cards(list_filtered_, div_id_, cards_category_);
    return true;
}

/*----------------------------------------------------*/
/* AUTO card gen
------------------------------------------------------ */
function gen_cards(list_filered_, id_name_, cards_category_){
    var html_gened;
    html_gened = "";
    var $pfo_bundle = $(id_name_);
    $pfo_bundle.slideUp(300);
    for (var i = 0; i < list_filered_.length; i++) {
        html_gened += " <li class=\"pfo-item\">\n" +
            "<div class=\""+
            cards_category_+
            " card col-lg-4 col-md-4 col-xs-6 col-sm-6\" id=\"" + list_filered_[i].id_name + "\" default-cat=\""+c_S(list_filered_[i].tags[0])+"\">" +
            "    <span class=\"card-pic\">\n" +
            "      <div class = \"card-pic-crop\" >\n" +
            "      <img src=\""+ list_filered_[i].img_directory + list_filered_[i].img_cover + "\" alt=\""+list_filered_[i].img_cover+"\"/>\n" +
            "      </div> \n" +
            "      <div class=\"card-description\">\n" +
            "      <div class=\"card-des-title\">\n" +
            list_filered_[i].title+
            "      </div>\n" +
            "      <div class=\"card-des-explain\">\n" +
            list_filered_[i].description+
            "      </div>\n" +
            "      </div>\n" +
            "    </span>\n" +
            "</div>\n" +
            "</li>";
    }
    $pfo_bundle.html(html_gened).slideDown(200).css({top: -20, opacity: 0}).
    animate({top: 0, opacity: 1}, 200);
}



//   --------------------------------   --------------------------------    --------------------------------
/*----------------------------------------------------*/
/* Const Intv Thread
------------------------------------------------------ */
// - compute at load
$(window).on('load', startEngine);
// ----- Core Animation Code
function startEngine() {
    // alert("Done");
    var FrameTimer = setInterval(function(){
        // About me experience rendering
        Callback_Calculate(); Callback_Render(); Callback_file_system();
        // side_bar
        // Callback_Sidebar();
    },10);
}

var G_prev_url = "";
function Callback_file_system(){
    var url      = window.location.href;     // Returns full URL
    if(G_prev_url !== url)
    {
        G_prev_url = url;
        var hash_val = "#"+url.split("#").pop();
        var tags = hash_val.split("/")[0];
        tags = tags.split("_");
        var tag = tags[0];
        //For page refreshing
        if(G_target !== tag){
            // console.log(tag);
            //only if it is a valid page
            if(G_PAGE_REFERENCE.indexOf(tag)>=0)
            {
                G_target = tag;
                {
                    if(G_target === "#page-blog")
                    {
                        var sub_files = hash_val.split("/");
                        if(sub_files.length>=2)
                        {

                            //this will make sure it always goes to the main page
                            G_sidebar_selected_tags.current = sub_files[sub_files.length-1];
                            G_sidebar_selected_tags.blog = sub_files[sub_files.length-1];
                        }else{
                            G_sidebar_selected_tags.current = "#page-blog_All_Blogs";
                            G_sidebar_selected_tags.blog = "#page-blog_All_Blogs";
                        }
                    }

                    loadSideBarRemappedBy(G_target);
                    updateItemTarget();
                    // reloadPage($(), false);
                    $(".nav-bar-click").each(function() {
                        var $this = $(this);
                        var href_str = $this.attr("href");
                        if(href_str === tag){
                            reloadPage($this, false);
                        }
                    });
                }
            }
            // else{
            //     console.warn("page not exist");
            // }
        }
    }
}
