CREATE TABLE tweets_source (
	tweet_id VARCHAR(255) PRIMARY KEY,
	screen_name VARCHAR(255),
	time VARCHAR(255),
	--Made timestamp compatible column
	url VARCHAR(255),
	twt_txt TEXT,
	twt_source VARCHAR(255),
	user_id VARCHAR(255)
)

--Website count
select substring(twt_txt from '.*://([^/]*)') as domain_name,
count(*)
from tweets_short GROUP BY domain_name
ORDER BY count(*) desc;

--add domain column
select *, substring(twt_txt from '.*://([^/]*)') as domain_name
from tweets_short;

select *, substring(twt_txt from '.*://([^/]*)') as domain_name
into twitter_table from tweets_source;


CREATE TABLE member_accounts (
	table_id SERIAL PRIMARY KEY,
	mem_name VARCHAR(255),
	chamber VARCHAR(30),
	mem_type VARCHAR(255),
	party VARCHAR(30),
	accounts TEXT,
	other_id VARCHAR(255),
	us_state VARCHAR(30),
	prev_prop VARCHAR(140)
)

--filter out caucuses etc
select * from member_accounts where mem_type='member'

--Panda manipulation
CREATE TABLE accounts (
	account_id BIGINT PRIMARY KEY,
	bioguide_id VARCHAR(30),
	mem_name VARCHAR(255),
	screen_name VARCHAR(255)	
)

select twitter_table.tweet_id, accounts.account_id, twitter_table.screen_name, 
accounts.mem_name,twitter_table.twt_time, twitter_table.url, twitter_table.twt_txt, 
twitter_table.user_id, twitter_table.domain_name
INTO final_table
from twitter_table, accounts
where twitter_table.screen_name = accounts.screen_name
AND domain_name IS NOT NULL


select * from final_table
where domain_name != 't.co' and domain_name != 'pbs.twimg.com' and domain_name != 'video.twimg.com' and domain_name != 'twitter.com'
and domain_name != 'bit.ly' and domain_name != 'trib.al' and domain_name != 'goo.gl' and domain_name != 'youtu.be'
and domain_name != 'www.pscp.tv' and domain_name != 'fb.me' and domain_name != 'ow.ly' and domain_name != 'www.google.com'

select domain_name,
count(*)
from final_table 
where domain_name != 't.co' and domain_name != 'pbs.twimg.com' and domain_name != 'video.twimg.com' and domain_name != 'twitter.com'
and domain_name != 'bit.ly' and domain_name != 'trib.al' and domain_name != 'goo.gl' and domain_name != 'youtu.be'
and domain_name != 'www.pscp.tv' and domain_name != 'fb.me' and domain_name != 'ow.ly' and domain_name != 'www.google.com'
GROUP BY domain_name
ORDER BY count(*) desc;
--We might want to use one of these links as a control

CREATE TABLE members (
	table_id SERIAL PRIMARY KEY,
	congress INTEGER,
	chamber VARCHAR(30),
	icpsr INTEGER,
	state_icpsr INTEGER,
	district_code INTEGER,
	state_abbr VARCHAR(3),
	party_code INTEGER,
	occupancy VARCHAR(255),
	last_means VARCHAR(255),
	bioname VARCHAR(255),
	bioguide_id VARCHAR(30),
	born INTEGER,
	diet INTEGER,
	nominate_dim1 DECIMAL,
	nominate_dim2 DECIMAL,
	nominate_log_likelihood DECIMAL,
	nominate_geo_mean_probability DECIMAL,
	nominate_number_of_vote VARCHAR(10),
	nominate_number_of_error VARCHAR(10),
	conditional VARCHAR(255),
	nokken_poole_dim1 DECIMAL,
	nokken_poole_dim2 DECIMAL
)

select final_table.bioguide_id, final_table.domain_name, 
members.party_code,members.bioname,members.nominate_dim1, 
members.nominate_dim2,members.nominate_log_likelihood,
members.nominate_geo_mean_probability, members.nominate_number_of_vote,
members.nominate_number_of_error, members.nokken_poole_dim1,
members.nokken_poole_dim2
INTO analysis_table
from final_table, members
where final_table.bioguide_id = members.bioguide_id and
domain_name != 't.co' and domain_name != 'pbs.twimg.com' and domain_name != 'video.twimg.com' and domain_name != 'twitter.com'
and domain_name != 'bit.ly' and domain_name != 'trib.al' and domain_name != 'goo.gl' and domain_name != 'youtu.be'
and domain_name != 'www.pscp.tv' and domain_name != 'fb.me' and domain_name != 'ow.ly' and domain_name != 'www.google.com'

select domain_name, count(domain_name), round(avg(nominate_dim1),3) AS nominate_dim1, round(avg(nominate_dim2),3) AS nominate_dim2
INTO test_table
from analysis_table
group by domain_name
order by count(domain_name) desc,
LIMIT 100

select round(avg(nominate_dim1),3) AS nominate_dim1, round(avg(nominate_dim2),3) AS nominate_dim2
from analysis_table
LIMIT 100


select domain_name, count(domain_name), round(avg(nominate_dim1),3) AS nominate_dim1, round(avg(nominate_dim2),3) AS nominate_dim2
INTO test_table
from analysis_table
group by domain_name
order by count(domain_name) desc,
LIMIT 100

Select bioname, count(bioname), domain_name, count(domain_name), nominate_dim1, nominate_dim2 
--INTO proportion_test_table
FROM analysis_table 
WHERE domain_name = 'www.nytimes.com' or domain_name = 'www.foxnews.com'
GROUP BY bioname, domain_name, nominate_dim1, nominate_dim2
order by bioname

Select bioname, domain_name, nominate_dim1, nominate_dim2, total
INTO total_table
FROM analysis_table 
join
(SELECT bioname as name2, count(bioname) as total from analysis_table 
GROUP BY bioname) AS total_count ON analysis_table.bioname=total_count.name2


UPDATE total_table
SET domain_name = REPLACE(domain_name, 'nyti.ms', 'www.nytimes.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'wapo.st', 'www.washingtonpost.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'insider.foxnews.com', 'www.foxnews.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'apnews.com', 'www.apnews.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'nbcnews.trib.al', 'www.nbcnews.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'video.foxnews.com', 'www.foxnews.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'cnn.it', 'www.cnn.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'politi.co', 'www.politico.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'www.buzzfeednews.com', 'www.buzzfeed.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'apne.ws', 'www.apnews.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'usat.ly', 'www.usatoday.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'fxn.ws', 'www.foxnews.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'mobile.nytimes.com', 'www.nytimes.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'video.foxbusiness.com', 'www.foxbusiness.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'www.huffpost.com', 'www.huffingtonpost.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'n.pr', 'www.npr.org')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'on.wsj.com', 'www.wsj.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'm.huffpost.com', 'www.huffingtonpost.com')
UPDATE total_table
SET domain_name = REPLACE(domain_name, 'reut.rs', 'www.reuters.com')

SELECT * into filtered_table FROM total_table 
WHERE domain_name in ('www.washingtonpost.com', 'www.nytimes.com', 'thehill.com', 'www.politico.com', 'www.cnn.com',
'www.wsj.com', 'www.foxnews.com', 'www.vox.com', 'www.usatoday.com', 'www.nbcnews.com', 'www.washingtonexaminer.com',
'www.npr.org', 'www.apnews.com', 'www.bloomberg.com', 'www.huffingtonpost.com', 'www.axios.com', 'www.breitbart.com',
'www.chicagotribune.com', 'www.nationalreview.com', 'freebeacon.com', 'www.msnbc.com','apple.news','www.newsweek.com'
'www.forbes.com', 'www.buzzfeed.com', 'www.foxbusiness.com', 'www.nydailynews.com', 'thinkprogress.org', 'www.motherjones.com',
'nypost.com', 'www.newyorker.com', 'www.pbs.org', 'thefederalist.com', 'reason.com', 'theintercept.com', 'slate.com',
'www.dailywire.com', 'www.conservativereview.com', 'www.reuters.com')

select domain_name, round(avg(nominate_dim1),3) AS nominate_dim1, round(avg(nominate_dim2),3) AS nominate_dim2, total
from filtered_table
GROUP BY domain_name, total


select accounts.account_id, accounts.bioguide_id, accounts.mem_name, accounts.screen_name, members.chamber, members.state_abbr, members.party_code
into partycode_table
from accounts, members
where accounts.bioguide_id = members.bioguide_id

select domain_name, round(avg(nominate_dim1),3) AS nominate_dim1, 
round(avg(nominate_dim2),3) AS nominate_dim2, count(domain_name) 
from dem_table GROUP BY domain_name


select domain_name, count(domain_name) as domain_count, round(avg(nominate_dim1),3) AS nominate_dim1, round(avg(nominate_dim2),3) AS nominate_dim2,
round(stddev_samp(nominate_dim1),3) AS dim1_stddev, round(stddev_samp(nominate_dim2),3) AS dim2_stddev into tenthousand_db
from analysis_table 
where domain_name NOT LIKE '%.gov'
group by domain_name
order by count(domain_name) desc
LIMIT 10000

select * from tenthousand_db

select domain_name, domain_count, nominate_dim1, nominate_dim2, dim1_stddev, dim2_stddev, round((dim1_stddev/sqrt(domain_count-1))::numeric,3) as dim1_stderr,
round((dim2_stddev/sqrt(domain_count-1))::numeric,3) as dim2_stderr
into final_db
from tenthousand_db
where domain_count>1
group by domain_name, domain_count, nominate_dim1, nominate_dim2, dim1_stddev, dim2_stddev
order by domain_count desc


drop table final_db

select * from final_db