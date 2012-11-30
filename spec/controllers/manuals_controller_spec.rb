require 'spec_helper'

describe ManualsController do
	let!(:manual) { Fabricate(:manual) }
	let(:mr_user) { Fabricate(:user_testing) }
	# let!(:manual_two_speech) { Fabricate(:manual_two_speech) }

	describe 'index' do
		it "assigns a list of manuals" do
			get(:index, :user_id => mr_user.id)
			assigns(:manuals).should eq [manual]
    end
	end

	describe 'show' do
		it "assigns a current manual" do
			controller.stub(:current_user).and_return(mr_user)
			get(:show, :user_id => mr_user.id, :id => manual.id)
			assigns(:manual).should eq manual
		end


		it "assigns a list of the current user's speeches from the current manual" do
			sign_in mr_user
			speech = Fabricate(:speech, :user => mr_user)
			get(:show, :user_id => mr_user.id, :id => speech.manual.id)
			assigns(:speeches).first.should eq speech
		end

		it "doesn't include speeches from other manuals in the speeches list" do
			sign_in mr_user
			speech1 = Fabricate(:speech, :user => mr_user)
			speech2 = Fabricate(:speech, :user => mr_user)
			get(:show, :user_id => mr_user.id, :id => speech1.manual.id)
			assigns(:speeches).should eq [speech1]
		end
	end

end