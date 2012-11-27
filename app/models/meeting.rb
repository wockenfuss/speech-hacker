class Meeting < ActiveRecord::Base
  attr_accessible :meeting_date, :meeting_time

  has_many :attendances

  before_save :parse_date

  validates :meeting_date, :presence => true
  validates :meeting_time, :presence => true,
            :format => { :with => /\d{2}\:\d{2}/,
                         :message => "format should be HH:MM" }

  def parse_date
    # Given MM/DD/YYYY, translate to YYYY/MM/DD
    if (self.meeting_date.to_s =~ /\d{4}-\d{2}-\d{2}/) == nil
      self.errors.add :meeting_date,
              "format should be MM/DD/YYYY"
      return false
    end

    split_date = self.meeting_date.to_s.split('-')
    self.meeting_date = Date.parse("#{split_date[0]}-#{split_date[2]}-#{split_date[1]}")
  end
end
