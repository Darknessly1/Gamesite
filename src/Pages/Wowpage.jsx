import WowNav from '../Headers/WowNav';
import '../index.css'

const WowPage = () => {

    return (
        <div className="wow-page p-6">

            <h1 className="text-3xl font-bold mb-6 text-center">World of Warcraft Information</h1>

            <div className='m-3'>
                <WowNav />
            </div>

        </div>
    );
};

export default WowPage;
