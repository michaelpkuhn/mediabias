select domain_name, domain_count, nominate_dim1, nominate_dim2, dim1_stddev, 
dim2_stddev, round((dim1_stddev/sqrt(domain_count-1))::numeric,3) as dim1_stderr,
round((dim2_stddev/sqrt(domain_count-1))::numeric,3) as dim2_stderr
into final_db
from tenthousand_db
where domain_count>1
group by domain_name, domain_count, nominate_dim1, nominate_dim2, dim1_stddev, dim2_stddev
order by domain_count desc
