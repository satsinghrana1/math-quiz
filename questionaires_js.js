jQuery(document).ready(function(){
	
	/********	FRONT-END	*******/	

	/****************** GET QUIZ DATA ON PAGE LOAD **********************/

	jQuery("#playQuizHomepage").click(function(){
		jQuery.ajax({
			type : "get",
			url : questionaires.ajaxurl+"?action=qsnPlayquizfromHomepage",
			beforeSend: function(){
				jQuery("#playQuizHomepage").val("loading...");
			},
			success: function(r){
				window.location.href = window.location.href+r;
			}
		});
	});


	

	if (document.referrer !="https://www.facebook.com/") {
		jQuery("#playQuizeBtn").text("Play Again")
	}else{
		jQuery("#playQuizeBtn").text("Play");
		
		// jQuery.ajax({
		// 	type : "get",
		// 	url : questionaires.ajaxurl+"?action=qsnPlayquizfromHomepage",
		// 	beforeSend: function(){
		// 		jQuery(".playQuizeBtn-start #playQuizeBtn").html("Loading please wait.");
		// 		setTimeout(function(){

		// 			jQuery(".playQuizeBtn-start #playQuizeBtn").html("Loading please wait..");
		// 		},500);
		// 		setTimeout(function(){

		// 			jQuery(".playQuizeBtn-start #playQuizeBtn").html("Loading please wait...");
		// 		},1000);
		// 		setTimeout(function(){

		// 			jQuery(".playQuizeBtn-start #playQuizeBtn").html("Loading please wait.");
		// 		},1500);
		// 		setTimeout(function(){

		// 			jQuery(".playQuizeBtn-start #playQuizeBtn").html("Loading please wait..");
		// 		},1600);
		// 		setTimeout(function(){

		// 			jQuery(".playQuizeBtn-start #playQuizeBtn").html("Loading please wait...");
		// 		},1800);
		
		// 	},
		// 	success: function(r){
		// 		setTimeout(function(){
		// 		window.location.href = "https://rsmfoundation.org/"+r;
					
		// 		},2000);
		// 	}
		// });

	}
	
	if (jQuery("qns-quiz-wrapper")==1) {

		getQuizDataOnPageLoad();
	}

	function getQuizDataOnPageLoad(){

		var cq = jQuery("#cq").val();
		var nq = jQuery("#nq").val();
		var pq = jQuery("#pq").val();

		jQuery.ajax({
			type : "get",
			url : questionaires.ajaxurl+"?action=qsnGetQuizDataOnPageLoad"
									   +"&cq="+cq
									   +"&nq="+nq
									   +"&pq="+pq,
				beforeSend: function(){
					jQuery(".qns-quiz-wrapper-loading-overlay").show();

				},
				success: function(res) {					
					jQuery(".qns-quiz-wrapper-loading-overlay").fadeOut();

					if (res.status == 0) {
						var data = '<h3 class="qns-quiz-title">Facebook Quiz</h3>'
									+'<p class="qns-no-questions">Quiz Is Not Ready Yet.</p>';
						jQuery(".qns-quiz-wrapper").html(data);
						return;
					}

					if (res.nq == 5 && res.userAnswer != undefined) {
						jQuery("#getNextQuestion").text("Finish");
						goToResultPage(res);						
					}

					// jQuery(".qns-quiz-wrapper").prepend('<h3 class="qns-quiz-title">Facebook Quiz</h3>');


					jQuery("#quizQuestion").html(res.question);

					var optionsList = "";	

					for (option in res.options){

						if (option == res.userAnswer) { 
							var checked ="checked=checked"; 
							var checkedClass =" selected";
						}else{
							var checked =""; 
							var checkedClass ="";
						}

					optionsList+="<li class='qns-option-li-fe'>"
									+"<label class='qns-option-label-fe"+checkedClass+"' for='"+option+"'>"+res.options[option]+"</label>"
									+"<input class='qnsOptionRadio' "+checked+" id='"+option+"' type='radio' value='"+option+"' name='userAnswer' >"
								+"</li>";
					}

					jQuery("#quizOptionsUl").html("");

					jQuery("#quizOptionsUl").append(optionsList).hide().fadeIn("fast");
					// jQuery("#getNextQuestion").fadeIn(1000);


					if (res.pq == -1) {
						jQuery("#getPreviousQuestion").hide();
					}else{
						jQuery("#getPreviousQuestion").show();
					}
			}
		});
	}




	/****************** START QUIZ **********************/

	jQuery("#startQuiz").click(function(){
		jQuery("#startQuiz").attr("disabled","disabled");


		var CT = Date.now(); //CURRENT TIME


			jQuery.ajax({
				type : "get",
				url : questionaires.ajaxurl+"?action=qsnStartQuiz&iniT="+CT,
				beforeSend: function(){
					jQuery(".qns-quiz-wrapper-loading-overlay").show();

				},
				success: function(res) {
                    
					// jQuery(".qns-quiz-wrapper-before-start").remove();
					// var start_TIME= new Date(res.RSM_Quiz_Start_Time);;
                     // console.log(res,"res")


					var quizHolder = '<div class="qns-quiz-wrapper">'
					+'<input type="hidden" name="cq" id="cq" value="0">'
					+'<input type="hidden" name="nq" id="nq" value="1">'
					+'<input type="hidden" name="pq" id="pq" value="-1">'
					+'<input type="hidden" name="RSM_Quiz_ID" id="RSM_quizId" value="'+res.RSM_Quiz_ID+'">'
					+'<input type="hidden" name="RSM_Quiz_Start_Time" id="RSM_Quiz_Start_Time" value="'+res.RSM_Quiz_Start_Time+'">'
					// +'<input type="text" name="iniT" id="iniT" value="'+Date.now()+'">'
					// +'<input type="text" name="RSM_Quiz_Start_Time" id="RSM_Quiz_Start_Time" value="'+start_TIME+'">'
					+'<div class="qns-quiz-question">'
					+'<h3 id="quizQuestion">Question</h3>'
					+'</div>'
					+'<div id="qnsMessage"></div>'
					+'<div class="qns-quiz-options">'
					+'<ul id="quizOptionsUl"></ul>'
					+'</div>'
					+'<div class="qns-quiz-btns">'
					+'<button class="quiz-btns" id="getPreviousQuestion">Previous</button>'
					+'<button class="quiz-btns" id="getNextQuestion">Next</button>'
					+'</div>'
					+'<div class="qns-quiz-wrapper-loading-overlay">'
					+'<img src="'+questionaires.pluginImagesPath+'/loading.gif">'
					+'</div>'
					+'</div>';

					jQuery(".qns-container").append(quizHolder);
					jQuery(".qns-quiz-wrapper").hide().fadeIn(1000);
					
					jQuery("#qnsQuizeTimeTitle").text("Quiz Timer").hide().fadeIn(500);
					//jQuery("#qnsQuizeTime").text("00:00").hide().fadeIn(500);
					
					jQuery("#qnsCurrentQuestionNumberTitle").text("Questions").hide().fadeIn(500);
					jQuery("#qnsCurrentQuestionNumber").text("1/5").hide().fadeIn(500);

					jQuery("#quizMinutes").text("00").hide().fadeIn(500);
					jQuery("#quizTimeColon").text(":").hide().fadeIn(500);
					jQuery("#quizSeconds").text("00").hide().fadeIn(500);

					if (jQuery(".time-quiz-main-sec").hasClass("before-start")) {
						jQuery(".time-quiz-main-sec").removeClass("before-start");
						jQuery("#startQuiz").hide();

						jQuery('html, body').animate({
						scrollTop: jQuery(".qns-quiz-wrapper").offset().top-190
						}, 2000);
					}



					// var quizStartTime = jQuery("#RSM_Quiz_Start_Time").val() * 1000;
					var quizStartTime = jQuery("#RSM_Quiz_Start_Time").val();
					var nowTime       =  Date.now() ;//new Date().valueOf();

					    // console.log(new Date(quizStartTime),"dsfdsfdsfsf",new Date(),"dsfsfdsf");

					var d, h, m, s;

					var ms =   nowTime - quizStartTime;
				    
				    s = Math.floor(ms / 1000);
				    m = Math.floor(s / 60);

				    s = s % 60;
				    h = Math.floor(m / 60);
				    m = m % 60;
				    d = Math.floor(h / 24);
				    h = h % 24;

				    // if (m<0) {m="00";}
				    // if (s<0) {s="00";}
			        // console.log(m,s,"sdfsfds");


			        if (res.RSM_Quiz_IS_STARTING == 1) {
			        	jQuery("#quizMinutes").text("00"); 
						jQuery("#quizSeconds").text("00");
			        }else{
						jQuery("#quizMinutes").text(m); 
						jQuery("#quizSeconds").text(s);
			        }
					
					countQuizTime();

					getQuizDataOnPageLoad();						
				}
			});
		
	});



	/****************** GET NEXT QUESTION **********************/

	jQuery(".qns-container").on("click", "#getNextQuestion", function(){



		if (jQuery("#getNextQuestion").text() == "Finish") {

		
					var quizStartTime = jQuery("#RSM_Quiz_Start_Time").val();
					var nowTime       =  Date.now() ;//new Date().valueOf();

					  

					var d, h, m, s;

					var ms =   nowTime - quizStartTime;
				    
				    s = Math.floor(ms / 1000);
				    m = Math.floor(s / 60);

				    s = s % 60;
				    h = Math.floor(m / 60);
				    m = m % 60;
				    d = Math.floor(h / 24);
				    h = h % 24;

		}else{
			var m=s="";
		}



		if (jQuery("input[name=userAnswer]:checked").length <= 0) {
			
			jQuery("#qnsMessage").html("Please select your answer").hide().fadeIn();
			
			return false;

		}else{

			if (jQuery("#nq").val()==5) {
				jQuery("#quizMinutes").attr("id", "");
				jQuery("#quizSeconds").attr("id", "");
			}

			var cq  = jQuery("#cq").val();
			var nq  = jQuery("#nq").val();
			var pq  = jQuery("#pq").val();
			var ua  = jQuery("input[name='userAnswer']:checked").val();


			jQuery.ajax({
				type : "get",
				url : questionaires.ajaxurl+"?action=qsnGetNextQuestion"
										   +"&cq="+cq
										   +"&nq="+nq
										   +"&pq="+pq
										   +"&ua="+ua
										   +"&m="+m
										   +"&s="+s,
				beforeSend: function(){
					jQuery(".qns-quiz-wrapper-loading-overlay").show();

				},
				success: function(res) {

					jQuery(".qns-quiz-wrapper-loading-overlay").hide();



					if (res.quizStatus == "finish") { 
						jQuery("#getPreviousQuestion").hide();
						jQuery("#getNextQuestion").hide();
						console.log(res);
						goToResultPage(res);;
						return false;
					}

					jQuery("#cq").val(res.cq);
					
					if(res.nq > 4){
						jQuery("#getNextQuestion").text("Finish");
					}
					if(res.pq > -1){
						jQuery("#getPreviousQuestion").show();
					}

					jQuery("#nq").val(res.nq);
					jQuery("#qnsCurrentQuestionNumber").text(res.nq+"/5")
					jQuery("#pq").val(res.pq);

					jQuery("#quizQuestion").html(res.question);

					var optionsList = "";



						for (option in res.options){


							if (option == res.userAnswerOld) { 
								var checked ="checked=checked"; 
								var checkedClass =" selected";
							}else{
								var checked =""; 
								var checkedClass ="";
							}

								optionsList+="<li class='qns-option-li-fe'>"
												+"<label class='qns-option-label-fe"+checkedClass+"' for='"+option+"'>"
													+res.options[option]+
												"</label>"+
												"<input class='qnsOptionRadio' "+checked+" id='"+option+"' type='radio' value='"+option+"' name='userAnswer' >"
											+"</li>";
						}

						jQuery("#quizOptionsUl").html("");
						jQuery("#quizOptionsUl").append(optionsList).hide().fadeIn();
						jQuery("#qnsMessage").text("");
						
				}
			});
		}
	});


	/****************** GET PREVIOUS QUESTION **********************/

	jQuery(".qns-container").on("click", "#getPreviousQuestion", function(){
	// jQuery("#getPreviousQuestion").click(function(){

			var cq = jQuery("#cq").val();
			var nq = jQuery("#nq").val();
			var pq = jQuery("#pq").val();
			var ua = jQuery("input[name='userAnswer']:checked").val();

			jQuery.ajax({
				type : "get",
				url : questionaires.ajaxurl+"?action=qsnGetPreviousQuestion"
										   +"&cq="+cq
										   +"&nq="+nq
										   +"&pq="+pq
										   +"&ua="+ua,
				beforeSend: function(){
					jQuery(".qns-quiz-wrapper-loading-overlay").show();
				},
				success: function(res) {

					jQuery(".qns-quiz-wrapper-loading-overlay").hide();
				

						jQuery("#cq").val(res.cq);

						if(res.pq == -1){
							jQuery("#getPreviousQuestion").hide();
						}
						jQuery("#getNextQuestion").text("Next");

						

						jQuery("#nq").val(res.nq);
						jQuery("#pq").val(res.pq);
						jQuery("#qnsCurrentQuestionNumber").text(res.nq+"/5").fadeIn()


						jQuery("#quizQuestion").html(res.question);

						var optionsList = "";

						for (option in res.options){

							if (option == res.userAnswerOld) { 
								var checked ="checked=checked"; 
								var checkedClass =" selected";
							}else{
								var checked =""; 
								var checkedClass ="";
							}

								optionsList+="<li class='qns-option-li-fe'>"
												+"<label class='qns-option-label-fe"+checkedClass+"' for='"+option+"'>"
													+res.options[option]+
												"</label>"+
												"<input class='qnsOptionRadio' "+checked+" id='"+option+"' type='radio' value='"+option+"' name='userAnswer' >"
											+"</li>";
						}

						jQuery("#quizOptionsUl").html("");
						jQuery("#quizOptionsUl").append(optionsList).hide().fadeIn(300);
					
					
				}
			});
	
	});


	/****************** SHOW RESULT ON PAGE LOAD IF QUIZ IS ALREDY FINISHED **********************/

	// function showResultScreen(result){

	// 	console.log(result)

	// 	//appendQuizResult(result);		
	// }

	/****************** GET QUIZ RESULT ON FINISH **********************/

	function goToResultPage(res){

		jQuery(".qns-quiz-wrapper-loading-overlay").show();
		// console.log(res)

		window.location = "/math-challenge-result?RSM_Quiz_ID="+res.RSM_Quiz_ID;

	} 

	/*************** SELECT ANSWER OF QUESTION ****************/

	jQuery(".qns-container").on("click", ".qns-option-label-fe", function(){
		jQuery(".qns-option-label-fe").removeClass("selected");
		jQuery(this).addClass("selected");
	});


	/************************** APPEND QUIZ RESULT ****************************/

	// function appendQuizResult(result){

		// jQuery(".qns-quiz-wrapper").html("");
		// console.log(result)

		// var msg = "";
		// var img = "";

		// if (result.scenarioIS == 11 || result.scenarioIS == 12) {

		// 	imageUrl = questionaires.pluginImagesPath+"rtf.jpg";
		// 	msg="Race to the Finish Line: You know the material, but you will race past important details and the steps in multi-step problems in your quest to get to the finish line";
		// 	img ="<img id='resultImage' src='"+imageUrl+"' />";
		// }
		// if (result.scenarioIS == 21) {
		// 	imageUrl = questionaires.pluginImagesPath+"sas.jpg";

		// 	msg="Scan and Solve: You definitely know the material, but you can occasionally miss subtle and vital details.";
		// 	img ="<img id='resultImage' src='"+imageUrl+"' />";
			
		// }
		// if (result.scenarioIS == 31) {

		// 	imageUrl = questionaires.pluginImagesPath+"ss.jpg";
			

		// 	msg="Solid Start: It may have been awhile since you’ve approached these kinds of problems, but don’t fear. You’re off to a good start, grease the wheels and try again!";
		// 	img ="<img id='resultImage' src='"+imageUrl+"' />";
			
		// }
		// if (result.scenarioIS == 41 || result.scenarioIS == 42) {

		// 	imageUrl = questionaires.pluginImagesPath+"dtos.jpg";

		// 	msg="Do the One-Step: One-step problems are a piece of cake for you, but if the path to the solution isn’t immediately evident it’s possible you won’t really want to spend the time getting there. ";
		// 	img ="<img id='resultImage' src='"+imageUrl+"' />";
			
		// }
		// if (result.scenarioIS == 51 || result.scenarioIS == 52) {

		// 	imageUrl = questionaires.pluginImagesPath+"tab.jpg";

		// 	msg="Take a Bow: You know the material. You catch the subtle details. And multi-step problems don’t phase you. Grab your Fields Medal Now.";
		// 	img ="<img id='resultImage' src='"+imageUrl+"' />";
			
		// }


		// var sr = '<div class="qns-share-your-result">';
		//    sr += '<p>Share Your Result On Facebook.<input id="shareOnFb" type="button" name="shareOnFb" value="Share on Facebook"></p>';
		//    sr += '</div>';

		// jQuery(".qns-quiz-wrapper").html("");
		// jQuery(".qns-quiz-wrapper").append(msg+img+sr).fadeIn("slow");	
		
	// }

    

	function countQuizTime(){

		var newMinutes = +jQuery("#quizMinutes").text(); 
		var seconds = jQuery("#quizSeconds").text();
           
            
            if(seconds == 59){

            	newMinutes = +newMinutes + 1;
            	seconds = 00;  
            	          	
            }else{

            	seconds++;
            }

		    jQuery("#quizMinutes").text( newMinutes<10 ? "0"+ newMinutes: newMinutes );
		    jQuery("#quizSeconds").text( seconds<10 ? "0"+seconds: seconds );		

		setTimeout(function(){	countQuizTime();}	,1000)			
	}
});