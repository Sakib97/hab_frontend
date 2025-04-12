import styles from '../../css/Article.module.css'
import { Breadcrumb } from 'antd';
import LanguageToggle from '../../components/LanguageToggle';
import ArticleReacftions from './ArticleReactions';
import ArticleComments from './ArticleComments';
import Footer from '../../components/Footer';
const Article = () => {
    return (
        <div className={`${styles.article}`}>
            <div className={`container`}>
                <div className={styles.articleMenu}>
                    <Breadcrumb
                        style={{ fontSize: '18px', marginBottom: '10px' }}
                        separator=">"
                        items={[
                            {
                                title: 'Home',
                            },
                            {
                                title: 'Application Center',
                            }
                        ]}
                    />
                    <LanguageToggle onToggle={(isEnglish) => console.log(isEnglish)} />
                </div>

                <div className={`${styles.articleHead}`}>
                    <h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit, magnam!</h1>
                    <h5>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci omnis placeat dolores sequi odio quia, ipsum sit distinctio consequuntur aliquid.
                    </h5>
                    <img src="https://picsum.photos/900/300" alt="Article" className={styles.articleImage} />
                    <div className={`${styles.articleImageCaption}`}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, quaerat. </div>

                    <div className={`${styles.authorAndDateOfArticle}`}>
                        <div className={`${styles.authorPicOfArticle}`}>
                            <img className={`${styles.authorPicOfArticle}`} src="https://picsum.photos/400/180" alt="" />
                        </div>
                        <div className={`${styles.authorNameOfArticle}`}>
                            John Doe
                            <br />
                            <div style={{ fontSize: '13px', color: 'gray' }}>7 January 2025</div>
                        </div>
                    </div>

                </div>
                <hr />

                <div className={`${styles.articleBody}`}>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit incidunt minima modi blanditiis, accusantium dignissimos reprehenderit commodi tempora similique, veniam dolorum quod inventore deserunt provident rerum odit. Repellat ratione inventore distinctio eos quia dolorum soluta expedita, dolor aspernatur voluptate ducimus sequi voluptas assumenda sunt omnis obcaecati suscipit repudiandae esse deserunt optio praesentium illo quos. Atque illum id sint sed tempore enim dolore a, dicta minus beatae rem at eum cupiditate. Ad expedita laudantium cupiditate illum beatae, id nisi aliquam dolore iste dignissimos sint ut blanditiis fugit neque? Nam atque itaque, deleniti aspernatur ad iusto voluptatibus quos magni impedit? Quidem aperiam eveniet nemo provident libero magni cumque. Enim vitae rem, quisquam explicabo minus corporis omnis animi debitis reprehenderit ducimus possimus ratione impedit. Ipsa natus esse facilis necessitatibus reiciendis impedit adipisci voluptate molestias, soluta autem quae similique magni sapiente iure repellendus, velit fugiat hic reprehenderit? Velit laboriosam labore quibusdam libero fugit quas neque dolore minima amet veniam quod, cumque omnis corrupti fugiat ipsam perspiciatis fuga ea natus commodi quasi. Nihil veniam molestias modi exercitationem tenetur quia deleniti voluptatibus, sequi eos harum neque consequatur suscipit laborum tempora amet recusandae consectetur maiores mollitia praesentium ex nisi omnis? Debitis a suscipit sit necessitatibus, molestias repellat natus amet modi obcaecati labore nihil ipsum quam repellendus! Enim voluptatibus, ab illum sed eveniet repellendus exercitationem dolores quidem rem sequi facere minima, sint dolor officia cum itaque quisquam, quibusdam nesciunt. Eos porro nostrum ipsam sit debitis. Molestiae minus ex distinctio quis alias eaque temporibus blanditiis totam fugiat hic? Esse minima hic commodi est quos quam dignissimos! Nisi, incidunt? Eos veritatis, expedita optio odio ex unde aliquam, ea doloribus inventore ducimus, obcaecati illum a eveniet? Veritatis libero quis ea sequi, sed quod soluta quisquam ipsa deleniti voluptate tenetur saepe distinctio eos impedit mollitia cupiditate minus, fugit facilis a fuga doloremque amet praesentium. Praesentium, esse, illo repellat amet molestiae sint ipsa fugit perspiciatis eligendi officia cumque delectus accusamus eius! Repellat laudantium nesciunt distinctio laborum alias amet quaerat quas maiores perspiciatis, ratione nihil rem veritatis et ad, voluptatum ab provident voluptatem aliquam eius natus ipsa praesentium nostrum! Nam provident placeat vitae necessitatibus porro eveniet magni, minus molestias. Quo harum corrupti necessitatibus mollitia. Nemo, accusamus doloribus! Nostrum reprehenderit esse aperiam cum provident deleniti culpa cumque eaque nulla nihil magni adipisci a exercitationem natus quidem ullam nam, officiis itaque explicabo ut repudiandae est? Accusantium sed obcaecati aut aperiam exercitationem suscipit quis minima pariatur quos explicabo. Odit consequatur ratione at ad, saepe expedita quidem ex ab praesentium facilis debitis cupiditate cumque corrupti obcaecati quam repellendus, veritatis minus provident nostrum quia. Iste optio sapiente, ipsa eligendi quibusdam nostrum dolorum natus deleniti similique odio dolores excepturi obcaecati autem, omnis dolore. Nisi voluptates illum quisquam earum voluptatum similique dolores ab, eligendi iste, doloribus tempora quas nobis consequatur? Quod beatae quidem officiis eligendi quas dolores ratione, fugit quisquam voluptatum quia animi nemo ex nisi tempore, numquam quis. Nulla aliquam pariatur, laborum non tempora officia porro cum molestiae quae maxime, eum illo ab impedit veniam ipsum soluta ullam sint natus fugit! Iste expedita in quisquam odio veritatis nihil facilis, incidunt officia necessitatibus consequatur, fugiat tempora perspiciatis odit? Doloribus consequatur eaque maiores obcaecati laborum natus labore fugit similique praesentium deleniti libero soluta tempore placeat reiciendis qui saepe rerum, expedita accusamus. Modi sint molestiae pariatur nulla, ut atque ipsum facilis dicta eum, iusto obcaecati dolorum. Delectus quas maiores quos facilis molestias, debitis molestiae dolore excepturi doloremque, quis assumenda sed minus sapiente pariatur voluptatem, ab at commodi. Iste nam quod similique tempore nemo doloremque temporibus odio veniam autem atque est, dolore dolorum voluptate numquam fugiat sit eaque incidunt molestiae, quas necessitatibus quos! Delectus vero ut maxime, dolorem ex officiis non mollitia nostrum animi dicta consequatur, quas nihil reiciendis eligendi facere corrupti iure! Rerum accusamus earum voluptatum animi magni rem quisquam fuga aspernatur, maxime iure, eum qui autem? Ipsa, fugiat beatae. Ab ipsa repudiandae, eius vel accusantium fuga cum commodi deleniti inventore, voluptatem a laudantium maxime dicta natus libero corrupti minus velit quisquam hic impedit iusto consequatur ratione nostrum fugit. Odio veritatis, deleniti vel dolorem, nemo possimus error at explicabo minus illum distinctio rem repudiandae, alias rerum? Provident perspiciatis quo, numquam illo in doloribus facilis eaque recusandae voluptatem reiciendis inventore ab aspernatur, libero aliquid voluptates ipsa, natus reprehenderit ducimus ea! Cupiditate mollitia laboriosam est blanditiis ipsa nihil, asperiores deleniti sequi inventore corrupti, similique tempora aliquam illo doloremque aut assumenda eligendi neque quod beatae id fuga! Laborum praesentium quia, deleniti in aspernatur neque, sapiente nemo qui incidunt accusantium odio rerum consequatur assumenda inventore sed esse adipisci. Illum quo assumenda et a expedita magni aperiam iusto quibusdam natus qui, possimus soluta cumque pariatur facilis? Repellat tempore fugit maiores doloremque velit, quasi laboriosam similique nostrum, delectus nesciunt omnis aliquam itaque dicta ut aspernatur eveniet a veniam. Exercitationem eveniet ipsa veniam vitae minus, sunt repellendus aperiam quisquam nostrum, iusto quidem ab animi modi iure reprehenderit temporibus enim ullam. Reprehenderit, id explicabo, magni obcaecati vel quia quidem molestias deserunt mollitia harum in asperiores nobis nam, esse exercitationem laborum commodi ducimus? Velit eveniet quo eaque temporibus, officia sint consequatur, nesciunt vitae sed mollitia repellat, odit quibusdam? Ducimus, cupiditate sequi ut amet non quis quidem eum provident consequatur nihil praesentium nostrum. Amet cumque quae vel velit vero placeat, maxime recusandae sed at odio consectetur adipisci suscipit molestias laudantium harum blanditiis, quibusdam fugiat perspiciatis ducimus ab. Similique aut quam unde. Asperiores provident reiciendis eum odit et consectetur deleniti dolores porro. Rem non, incidunt, explicabo cum accusantium modi error nemo vero adipisci officia quam? Dolorum tenetur eum sed dolorem illum sequi perspiciatis, suscipit quibusdam dignissimos cupiditate excepturi quas soluta autem corrupti laborum deleniti minus harum magnam repellat quae velit. Eum, debitis! Dolores assumenda nemo, facilis nisi, blanditiis magnam dolore dignissimos ducimus libero nam totam nihil a nobis alias quia debitis quos deserunt mollitia excepturi laudantium asperiores distinctio eaque quam neque! Tempora, suscipit? Eius eaque totam magni mollitia nemo! Ratione dolor enim possimus nam natus repellendus expedita, earum omnis. Voluptate maiores hic repellat earum, assumenda error laudantium, pariatur quibusdam doloremque aliquam est neque optio?
                </div>

                <hr />
                <div className={`${styles.articleTags}`}>
                    <div className={`${styles.articleTagsTitle}`}>Tags:</div>
                    <div className={`${styles.articleTagsList}`}>
                        <button type='button' className={styles.articleTagsButton}>History</button>
                        <button type='button' className={styles.articleTagsButton}>Politics</button>
                        <button type='button' className={styles.articleTagsButton}>Culture</button>
                    </div>
                </div>
                <hr />
                <ArticleReacftions />
                <ArticleComments />
            </div>
            <Footer />

        </div>


    );
}

export default Article;